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

const table = document.getElementsByClassName("datadisplaytable")[0].children[1]

Array.from(table.children).map(curr => {
  // this is not a class node
  if (!curr.children[0].classList.contains("dddefault")) {
    return null
  } else if (curr.children.length < 24 || curr.children[LOCATION].innerText === "ONLINE INTERNET" || curr.children[LOCATION].innerText === "TBA") {
    return null
  }

  const [building, room] = curr.children[LOCATION].innerText.split(" ")

  return [
    curr.children[DAYS].innerText.split("").reduce((prev, curr) => prev + BITMAP[curr], 0),
    ...(curr.children[TIMES].innerText.split("-").map(str => {
      let [time, ampm] = str.split(" ")
      let [hours, minutes] = time.split(":")
      hours = Number(hours)
      return [hours + (ampm === "pm" && hours !== 12 ? 12 : 0), minutes].join(":")
    })),
    building,
    room
  ]
  //console.log("got a good one!", curr.children[DAYS-1].innerText, curr.children.length)

}).filter(e => e !== null)
