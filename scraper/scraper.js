const JSDOM = require("jsdom").JSDOM
const fs = require("fs")
const path = require("path")

/*** Constants for use in scraping ***/
// 8=days, 9=times, 22=location
const DAYS = 8
const TIMES = 9
const LOCATION = 22

const BITMAP = {
  "M": 1,
  "T": 2,
  "W": 4,
  "R": 8,
  "F": 16,
  "S": 32
}

const BUILDING_NAMES = new Set()

/*** Initial Scraping and Parsing ***/
const document = new JSDOM(fs.readFileSync(path.join(__dirname, "classes.html"), {encoding:"utf8"})).window.document
const table = document.getElementsByClassName("datadisplaytable")[0].children[1]

const rows = Array.from(table.children).map(curr => {
  // this is not a class node
  if (!curr.children[0].classList.contains("dddefault")) {
    return null
  } else if (curr.children.length < 24
    || curr.children[LOCATION].textContent === "ONLINE INTERNET"
    || curr.children[LOCATION].textContent.includes("TBA")
    || curr.children[LOCATION].textContent.includes("NONE")) {
    return null
  }

  const [building, room] = curr.children[LOCATION].textContent.split(" ")
  BUILDING_NAMES.add(building)

  return [
    curr.children[DAYS].textContent.split("").reduce((prev, curr) => prev + BITMAP[curr], 0),
    ...(curr.children[TIMES].textContent.split("-").map(str => {
      let [time, ampm] = str.split(" ")
      let [hours, minutes] = time.split(":")
      hours = Number(hours)
      return [hours + (ampm === "pm" && hours !== 12 ? 12 : 0), minutes].join(":")
    })),
    building,
    room
  ]

}).filter(e => e !== null)

const rows_csv = "days,start_time,end_time,building,room\n" + rows
  .map(row => row.join(","))
  .filter((val, i, self) => self.indexOf(val) === i)
  .join("\n")

/*** Storing of data into correct places for startup ***/
fs.writeFileSync(path.join(__dirname, "classes.csv"), rows_csv)

let sql = fs.readFileSync("./server/up_partial.sql", {encoding:"utf8"})
fs.writeFileSync(
  "./server/up.sql",
  sql.replace(/@BUILDINGS@/g, [...BUILDING_NAMES].map(building => `"${building}"`).join(","))
)
