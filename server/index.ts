import express, { Request, Response } from "express"
import path from "path"

const app = express()

app.use(express.static(path.join(__dirname, "web")))
//console.log(path.join(__dirname, "../../client/dist"))

// most normal usage
app.get("/chalkboards", async (req: Request, res: Response) => {
  console.log(req)
})

// admin only
app.post("/chalkboards", async (req: Request, res: Response) => {

})

app.listen(3000)
