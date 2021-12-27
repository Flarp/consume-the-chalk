import React from "react"
import { TableProps, titlecase } from "../utils"
import "bootstrap-icons/font/bootstrap-icons.css"

export class Table extends React.Component<TableProps> {
  constructor(props: TableProps) {
    super(props)
  }

  render() {
    return <div>
      <h2 style={{marginBottom: "0em"}}>Results</h2>
      <h4 onClick={_ => this.props.ret()} style={{marginTop: "0em", color: "blue"}}>
        <a>Return <i className="bi bi-arrow-counterclockwise"></i></a>
      </h4>
      <div style={{display: "flex", justifyContent: "center"}}>
        <table style={{textAlign: "center", width: "50%", fontSize: "1.5em"}}>
          <thead>
            <tr>
              <th>Location</th>
              <th>Color</th>
              <th>Panels</th>
              <th>Width</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
          {this.props.rows.map(row => <tr>
            <td>{row.building} {row.room}</td>
            <td>{titlecase(row.color)}</td>
            <td>{row.panels}</td>
            <td>{titlecase(row.width)}</td>
            <td>{row.number}</td>
          </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  }
}
