import express, { Request, Response } from "express"
import bodyParser from "body-parser"
import { Pool } from "pg"
import { KJUR } from "jsrsasign"
import path from "path"
import { readFileSync } from "fs"
import { Mutex } from "async-mutex"
import sleep from "sleep-promise"

import { COLORS, WIDTHS, ChalkForm, TIME } from "./utils"

let PUBLIC_KEY: string;
try {
  PUBLIC_KEY = readFileSync(path.join(__dirname, "id_rsa.pub"), "utf8")
  console.log("jimmy jazz?")
} catch (err) {
  PUBLIC_KEY = ""
  console.warn("No public key found: app will run in insecure mode")
}

const app = express()

const pool = new Pool(process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
} : {
  user: "postgres",
  password: "",
  database: "postgres",
  port: 5432,
})

const sqlMutex = new Mutex()

app.use(express.static(path.join(__dirname, "web")))
app.use(bodyParser.json({ limit: 1024, strict: true }))

// most normal usage
app.get("/chalkboards", async (req: Request<unknown, unknown, unknown, ChalkForm>, res: Response) => {
  let panelNums, days, count;
  const form: ChalkForm = {
    times: Array.isArray(req.query.times)
            && req.query.times.length === 2
            && req.query.times.every(time => typeof time === "string" && TIME.test(time))
              ? req.query.times
              : ["now", "now"],
    panels: Array.isArray(req.query.panels)
            && req.query.panels.length === 2
            && (panelNums = req.query.panels.map(str => Number(str)), panelNums.every(num =>
              Number.isInteger(num) && num > 0 && num < 5))
      ? [panelNums[0], panelNums[1]]
      : [1, 4],
    color: Array.isArray(req.query.color)
           && req.query.color.length < 4
           && req.query.color.every(color => COLORS.includes(color))
      ? req.query.color
      : typeof req.query.color === "string" && COLORS.includes(req.query.color)
        ? [req.query.color]
        : COLORS,
    width: Array.isArray(req.query.width)
           && req.query.width.length < 4
           && req.query.width.every(width => WIDTHS.includes(width))
      ? req.query.width
      : typeof req.query.width === "string" && WIDTHS.includes(req.query.width)
        ? [req.query.width]
        : WIDTHS,
    days: (days = Number(req.query.days), Number.isInteger(days) ? days & 63 : 0),
    number: (count = Number(req.query.number), Number.isInteger(count) ? count : 0)
    }
  let num;
  console.log(form, req.query)
  const {rows} = await pool.query(
    `SELECT * FROM chalkboards WHERE
      panels BETWEEN $1 AND $2 AND
      color = ANY($3) AND
      width = ANY($4) AND
      number >= $5::int AND
      (building, room) NOT IN (
        SELECT building, room FROM occupancies WHERE
          (days::int::bit(8) & $6::int::bit(8))::int <> 0 AND
          (current_date + $7::time, current_date + $8::time) OVERLAPS (current_date + start_time, current_date + end_time)
      );`, [
      ...form.panels,
      form.color,
      form.width,
      form.number,
      form.days,
      ...form.times
    ])
  console.log(rows)
  res.send(rows)
})

app.get("/admin", async (req: Request, res: Response) => {
  const release = await sqlMutex.acquire()
  try {
    const {rows} = await pool.query("SELECT * FROM chalkboards;")
    res.send(rows)
    // time out to prevent DDoSing
    await sleep(500)
  } finally {
    release()
  }
})

// admin only
app.post("/admin", async (req: Request, res: Response) => {
  if (PUBLIC_KEY !== "") {
    const key = new KJUR.crypto.Signature({"alg": "SHA1withRSA"});
    key.init(PUBLIC_KEY)
    key.updateString(JSON.stringify(req.body.row))
    if (!key.verify(req.body.signature)) {
      console.log("JIMMY JAZZ")
      res.send("no")
      return
    }
  }
  const row = req.body.row
  const argArray = [
    row.building,
    row.room,
    row.panels,
    row.width,
    row.color,
    row.number,
    row.id
  ]
  switch (req.body.operation) {
    case "delete":
      pool.query("DELETE FROM chalkboards WHERE id = $1::int;", [row.id])
      break;
    case "update":
      pool.query(`UPDATE chalkboards SET
        building = $1, room = $2, panels = $3::int,
        width = $4, color = $5, number = $6::int
        WHERE id = $7::int;`, argArray)
      break
    case "add":
      pool.query(`INSERT INTO chalkboards
        (building, room, panels, width, color, number)
        VALUES ($1, $2, $3::int, $4, $5, $6::int);`, argArray.slice(0, 6))
  }
})

app.listen(3000)
