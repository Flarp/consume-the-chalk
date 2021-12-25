import express, { Request, Response } from "express"
import { Pool } from "pg"
//import jsrsasign from "jsrsasign"
import path from "path"
//import { URLSearchParams } from "url"
import { COLORS, WIDTHS, ChalkForm, TIME } from "./utils"

const app = express()

const pool = new Pool({
  user: "postgres",
  password: "",
  database: "postgres",
  port: 5432,
})

app.use(express.static(path.join(__dirname, "web")))
//app.set('query parser', (queryString: string) => {
//  return new URLSearchParams(queryString)
//})

// most normal usage
app.get("/chalkboards", async (req: Request<unknown, unknown, unknown, ChalkForm>, res: Response) => {
  //console.log(req.query as ChalkForm)
  let panelNums, days;
  const form: ChalkForm = {
    times: Array.isArray(req.query.times)
            && req.query.times.length === 2
            && req.query.times.every(time => typeof time === "string" && TIME.test(time))
              ? req.query.times
              : ["00:00", "00:00"],
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
    days: (days = Number(req.query.days), Number.isInteger(days) ? days & 63 : 0)
    }
  let num;
  console.log(form, req.query)
  const {rows} = await pool.query(
    `SELECT * FROM chalkboards WHERE
      panels BETWEEN $1 AND $2 AND
      color = ANY($3) AND
      width = ANY($4) AND
      (building, room) NOT IN (
        SELECT building, room FROM occupancies WHERE
          (days::int::bit(8) & $5::int::bit(8))::int <> 0 AND
          (current_date + $6::time, current_date + $7::time) OVERLAPS (current_date + start_time, current_date + end_time)
      );`, [
      ...form.panels,
      form.color,
      form.width,
      form.days,
      ...form.times
    ])
  //console.log(rows)
  res.send(rows)
})

app.get("/admin", async (req: Request, res: Response) => {
  const {rows} = await pool.query("SELECT * FROM chalkboards;")
  res.send(rows)
})

// admin only
app.post("/admin", async (req: Request, res: Response) => {

})

app.listen(3000)
