import React from "react"
import { KEYUTIL } from "jsrsasign"
import { AdminProps, ChalkboardRow, BUILDINGS, COLORS, WIDTHS } from "../utils"

//const PROPERTIES_1 = ["building", "color", "panels", "width"] as const
const PROPERTIES_2 = ["building", "room", "color", "panels", "width"] as const

// lazyness, honestly
const PROPERTY_MAP: Record<string, Readonly<string[]>> = {
  building: BUILDINGS,
  color: COLORS,
  width: WIDTHS,
  panels: ["1","2","3","4"]
}

interface Props {
  admin: AdminProps,
  rows: ChalkboardRow[],
  update: (row: ChalkboardRow[], admin: AdminProps) => void,
  submit: () => void,
  ret: () => void,
}

export class Admin extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    return <div>
      <h2>Admin Table</h2>
      <h4 style={{color: "blue"}} onClick={_ => this.props.ret()}>Return</h4>
      <div style={{display: "flex", justifyContent: "center"}}>
        <table style={{textAlign: "center", width: "50%", fontSize: "1.5em"}}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Building</th>
              <th>Room</th>
              <th>Color</th>
              <th>Panels</th>
              <th>Width</th>
              <th>{/* edit placeholder */}</th>
            </tr>
          </thead>
          <tbody>
          {this.props.rows.map((row, i) => this.props.admin.currIndex !== i
            ? <tr>
                <td>{row.id}</td>
                {PROPERTIES_2.map(property => <td>{row[property]}</td>)}
                <td><i className="bi bi-pencil-square" onClick={_ => {
                  this.props.admin.currIndex = i
                  this.props.update(this.props.rows, this.props.admin)
                }}></i></td>
              </tr>
            : <tr>
                <td>{row.id}</td>
                {PROPERTIES_2.map(property => <td>
                  {Array.isArray(PROPERTY_MAP[property])
                    ? <select>
                        {PROPERTY_MAP[property].map((item: string) => <option selected={row[property] === item} value={item}>{item}</option>)}
                      </select>
                    : <input type="text" value={row[property]}/>
                  }
                </td>)}
                <td></td>
              </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  }
}
