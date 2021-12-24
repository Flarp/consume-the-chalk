import express, { Request, Response } from "express"
import { Pool } from "pg"
//import jsrsasign from "jsrsasign"
import path from "path"
//import { URLSearchParams } from "url"
import { COLORS, WIDTHS, ChalkForm } from "./types"

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
  let panelNums;
  const form: ChalkForm = {
    startTime: typeof req.query.startTime === "string"
      ? req.query.startTime
      : "23:59",
    endTime: typeof req.query.endTime === "string"
      ? req.query.endTime
      : "23:59",
    panels: Array.isArray(req.query.panels) && (panelNums = req.query.panels.map(str => Number(str)), panelNums.every(num => !isNaN(num)))
      ? [panelNums[0], panelNums[1]]
      : [1, 4],
    color: Array.isArray(req.query.color) && req.query.color.every(color => COLORS.includes(color))
      ? req.query.color
      : typeof req.query.color === "string" && COLORS.includes(req.query.color)
        ? [req.query.color]
        : COLORS,
    width: Array.isArray(req.query.width) && req.query.width.every(width => WIDTHS.includes(width))
      ? req.query.width
      : typeof req.query.width === "string" && WIDTHS.includes(req.query.width)
        ? [req.query.width]
        : WIDTHS
    }
  let num;
  console.log(form, req.query)
  const {rows} = await pool.query(
    "SELECT * FROM chalkboards WHERE panels = ANY($1) AND color = ANY($2) AND width = ANY($3);", [
      form.panels, // disgusting!!
      form.color,
      form.width
    ])
  console.log(rows)
  //console.log(req)
})

// admin only
app.post("/chalkboards", async (req: Request, res: Response) => {

})

app.listen(3000)
