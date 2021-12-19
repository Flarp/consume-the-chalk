import {RowDataPacket} from "mysql2"

export interface Chalkboard extends RowDataPacket {
  id: number,
  building: string,
  room: string,
  panels: number,
  width: "normal" | "wide" | "extra wide",
  color: "black" | "brown" | "green"
}

export interface Occupancy extends RowDataPacket {
  id: number,
  building: string,
  room: string,
  startTime: string,
  endTime: string,
  days: number
}
