export const COLORS = ["black", "brown", "green"]
export type Color = typeof COLORS[number]

export const WIDTHS = ["normal", "wide", "extra wide"]
export type Width = typeof WIDTHS[number]

export const BUILDINGS = ['CARC','FRIDY','ROWE','COLVD','COED','BURSN','CITY','MEMOR','FRET','STORR','DENNY','ROBIN','CHHS','BIOIN','GRNGR','MACY','MCEN','DUKE','EPIC','SMITH','WINN','JBCB','GYMNS','WOODW','SCIENC','ATKNS','CONE','GRIGG','BRNRD','ATAC'] as const
export type Building = typeof BUILDINGS[number]

export function titlecase(words: string): string {
  return words.split(" ").map(word => {
    let letters = word.split("")
    return [letters[0].toUpperCase(), ...letters.slice(1)].join("")
  }).join(" ")
}

export interface ChalkForm {
  width: Set<Width>
  color: Set<Color>
  panels: [number, number]
  startTime: string,
  endTime: string
}

export interface ChalkboardRow {
  id: number,
  building: Building,
  room: string,
  panels: number,
  width: Width,
  color: Color
}

export interface AdminProps {
  rows: ChalkboardRow[],
  key: string,
  currIndex: number
}

export interface TableProps {
  rows: ChalkboardRow[]
}

//export interface AdminForm {
//  location:
//}
