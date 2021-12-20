import React from "react"
import ReactDOM from "react-dom"

import { ChalkForm, ChalkboardRow } from "./types"

import { Form } from "./pages/Form"
//import { Table } from "./pages/Table.tsx"
//import { Admin } from "./pages/Admin.tsx"

interface MainState {
  page: "form" | "table" | "admin",
  form: ChalkForm
}

function chalkFormToRecord(form: ChalkForm): string[][] {
  return Object.entries(form).map(([key, value]: [string, any]) => [key, Array.isArray(value) ? value.join(",") : (value === null ? "" : value.toString())])
}

class Main extends React.Component<{}, MainState> {
  state: MainState = {
    page: "form",
    form: {
      width: new Set(),
      panelLow: 0,
      panelHigh: 3,
      color: new Set(),
      startTime: "now",
      endTime: "now",
      range: false
    }
  }

  updateForm(form: ChalkForm): void {
    this.setState({form})
  }

  async submit() {
    const queryString: string = new URLSearchParams(chalkFormToRecord(this.state.form)).toString()
    //console.log("did we even make it here")
    const response: ChalkboardRow[] = await fetch("/chalkboards?" + queryString).then(res => res.json())
  }

  render() {
    switch (this.state.page) {
      case "form":
        return <Form form={this.state.form} update={this.updateForm.bind(this)} submit={this.submit.bind(this)}/>
      default:
        return <div></div>
    }
  }

}

ReactDOM.render(<Main/>, document.getElementById("main"))
