import { Request } from "express"

export const COLORS = ["black", "brown", "green"]
export type Color = typeof COLORS[number]

export const WIDTHS = ["normal", "wide", "extra wide"]
export type Width = typeof WIDTHS[number]

export interface ChalkForm {
  width: Width[]
  color: Color[]
  panels: [number, number]
  startTime: string,
  endTime: string
}

export interface Chalkboard {
  id: number,
  building: string,
  room: string,
  panels: number,
  width: Width,
  color: Color
}

/*
export interface Occupancy extends RowDataPacket {
  id: number,
  building: string,
  room: string,
  startTime: string,
  endTime: string,
  days: number
}
*/
