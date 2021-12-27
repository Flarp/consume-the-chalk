import React from "react"
import { KEYUTIL } from "jsrsasign"
import { AdminProps, ChalkboardRow, BUILDINGS, COLORS, WIDTHS, Building, Color, Width, titlecase } from "../utils"

const properties = ["building", "room", "color", "panels", "width", "number"] as const;
type Properties = typeof properties[number]

interface Props {
  admin: AdminProps,
  rows: ChalkboardRow[],
  update: (row: ChalkboardRow[], admin: AdminProps) => void,
  submit: (operation: "update" | "delete" | "add", row: ChalkboardRow) => void,
  ret: () => void,
}

interface DropdownProps<E> {
  options: Readonly<E[]>,
  value: E,
  update: (value: E) => ChalkboardRow
}

function TypedDropdown<E>(props: DropdownProps<E>) {
  return <select value={props.value.toString()}>
    {props.options.map((item: E) =>
      <option value={item.toString()} onClick={_ => {
        props.update(item)
      }}>{titlecase(item.toString())}</option>
    )}
  </select>
}

function RowModifier(prop: { update: (row: ChalkboardRow) => void, row: ChalkboardRow}) {
  return [
    <TypedDropdown options={BUILDINGS} value={prop.row.building} update={((r: ChalkboardRow, val: Building) =>
      (r.building = val, prop.update(r))).bind(this, prop.row)}/>,

    <input type="text" value={prop.row.room} onChange={e => {
      prop.row.room = e.target.value
      prop.update(prop.row)
    }}/>,

    <TypedDropdown options={COLORS} value={prop.row.color} update={((r: ChalkboardRow, val: Color) =>
      (r.color = val, prop.update(r))).bind(this, prop.row)}/>,

    <TypedDropdown options={[1,2,3,4]} value={prop.row.panels} update={((r: ChalkboardRow, val: number) =>
      (r.panels = val, prop.update(r))).bind(this, prop.row)}/>,

    <TypedDropdown options={WIDTHS} value={prop.row.width} update={((r: ChalkboardRow, val: Width) =>
      (r.width = val, prop.update(r))).bind(this, prop.row)}/>,

    <TypedDropdown options={[1,2,3,4]} value={prop.row.number} update={((r: ChalkboardRow, val: number) =>
      (r.number = val, prop.update(r))).bind(this, prop.row)}/>
  ]
}

export class Admin extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  internalUpdate<E>(row: ChalkboardRow): void {
    this.props.rows[this.props.admin.currIndex] = row
    this.props.update(this.props.rows, this.props.admin)
  }

  render() {
    return <div>
      <h2>Admin Table</h2>

      <h4 style={{color: "blue"}} onClick={_ => this.props.ret()}>Return <i className="bi bi-arrow-counterclockwise"></i></h4>

      <h4 style={{color: "blue"}} onClick={_ => {
        const ind = this.props.rows.push(this.props.rows.length !== 0
          ? {...this.props.rows[this.props.rows.length - 1], id: -1}
          : {
            id: -1,
            building: BUILDINGS[0],
            room: "",
            color: COLORS[0],
            width: WIDTHS[0],
            panels: 1,
            number: 1
          })
        this.props.admin.currIndex = ind - 1
        this.props.update(this.props.rows, this.props.admin)
      }}>Add <i className="bi bi-plus-square"></i></h4>

      <input type="file" onChange={async e => {
        this.props.admin.key = await e.target.files[0].text()
        this.props.update(this.props.rows, this.props.admin)
      }}/>

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
              <th>Count</th>
              <th>{/* edit placeholder */}</th>
            </tr>
          </thead>

          <tbody>
          {this.props.rows.map((row: ChalkboardRow, i) => this.props.admin.currIndex !== i
            ? <tr>
                <td>{row.id}</td>
                {properties.map(property => <td>{titlecase(row[property].toString())}</td>)}
                <td><i className="bi bi-pencil-square" onClick={_ => {
                  this.props.admin.currIndex = i
                  this.props.update(this.props.rows, this.props.admin)
                }}></i></td>
              </tr>
            : <tr>
                <td><i className="bi bi-x-square" onClick={_ => {
                  const row = this.props.rows[i]
                  const rows = [...this.props.rows.slice(0, i), ...this.props.rows.slice(i + 1)]
                  this.props.admin.currIndex = -1
                  this.props.update(rows, this.props.admin)
                  if (row.id !== -1) {
                    this.props.submit("delete", row)
                  }
                }}></i></td>

                {RowModifier({update: this.internalUpdate.bind(this), row}).map(element => <td>{element}</td>)}

                <td><i className="bi bi-check-square" onClick={async _ => {
                  const row = this.props.rows[i]
                  this.props.admin.currIndex = -1
                  await this.props.update(this.props.rows, this.props.admin)
                  this.props.submit(row.id === -1 ? "add" : "update", row)
                }}></i></td>
              </tr>
          )}
          </tbody>

        </table>
      </div>
    </div>
  }
}
