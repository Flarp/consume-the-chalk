import { Request } from "express"

export const COLORS = ["black", "brown", "green"]
export type Color = typeof COLORS[number]

export const WIDTHS = ["normal", "wide", "extra wide"]
export type Width = typeof WIDTHS[number]

export const TIME = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/

export interface ChalkForm {
  width: Width[]
  color: Color[]
  panels: [number, number]
  times: [string, string],
  days: number
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
