import express, { Request, Response } from "express"
import { Pool } from "pg"
//import jsrsasign from "jsrsasign"
import path from "path"

const app = express()

const pool = new Pool({
  user: "postgres",
  password: "",
  database: "postgres",
  port: 5432,
  //host: "localhost"
})

app.use(express.static(path.join(__dirname, "web")))
//console.log(path.join(__dirname, "../../client/dist"))

// most normal usage
app.get("/chalkboards", async (req: Request, res: Response) => {
  const {rows} = await pool.query("SELECT * FROM occupancies LIMIT 10;")
  console.log(rows)
  //console.log(req)
})

// admin only
app.post("/chalkboards", async (req: Request, res: Response) => {

})

app.listen(3000)
