export interface ChalkForm {
  width: ("normal" | "wide" | "extra wide")[]
  color: ("black" | "brown" | "green")[]
  panelLow: number,
  panelHigh: number,
  range: boolean,
  startTime: string,
  endTime: string
}

export interface ChalkboardRow {
  location: string,
  panels: number,
  width: "normal" | "wide" | "extra wide",
  color: "black" | "brown" | "green"
}
