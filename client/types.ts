export type Color = "black" | "brown" | "green"
export type Width = "normal" | "wide" | "extra wide"

export interface ChalkForm {
  width: Set<Width>
  color: Set<Color>
  panelLow: number,
  panelHigh: number,
  range: boolean,
  startTime: string,
  endTime: string
}

export interface ChalkboardRow {
  location: string,
  panels: number,
  width: Width,
  color: Color
}

//export interface AdminForm {
//  location:
//}
