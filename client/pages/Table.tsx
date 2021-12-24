import React from "react"
import { TableProps } from "../types"

export class Table extends React.Component<TableProps> {
  constructor(props: TableProps) {
    super(props)
  }

  render() {
    return <div>
      <h2>Results</h2>
      <table>
        <tr>
          <th>Location</th>
          <th>Color</th>
          <th>Panels</th>
          <th>Width</th>
        </tr>
        {this.props.rows.map(row => <tr>
          <td>{row.building} {row.room}</td>
          <td>{row.color}</td>
          <td>{row.panels}</td>
          <td>{row.width}</td>
        </tr>)}
      </table>
    </div>
  }
}
