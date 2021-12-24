import React from "react"
import ReactDOM from "react-dom"

import { ChalkForm, AdminProps, ChalkboardRow } from "./types"

import { Form } from "./pages/Form"
import { Table } from "./pages/Table"
//import { Admin } from "./pages/Admin.tsx"

//import "./styles/main.css"

interface MainState {
  page: "form" | "table" | "admin",
  form: ChalkForm,
  admin: AdminProps,
  table: ChalkboardRow[]
}

function chalkFormToRecord(form: ChalkForm): string[][] {
  return [
    // get normal string pairs
    ...Object.entries(form)
      .filter(([_, val]) => typeof val === "string"),

    // parse arrays and sets
    ...Object.entries(form)
      .filter(([_, val]) => typeof val !== "string")
      .map(([key, value]: [string, string[] | Set<string>]) => Array.from(value).map(vVal => [key, vVal]))
      .flat()
      //[key, (console.log(value),"["+Array.from(value).join(",")+"]")])
  ]
  //return Object.entries(form).map(([key, value]: [string, any]) => [key, Array.isArray(value) ? value.join(",") : (value === null ? "" : value.toString())])
}

class Main extends React.Component<{}, MainState> {
  state: MainState = {
    page: "form",
    form: {
      width: new Set(),
      panels: [1, 4],
      color: new Set(),
      startTime: "now",
      endTime: "now",
    },
    table: [],
    admin: {
      rows: [],
      key: "",
      currIndex: -1,
    }
  }

  updateForm(form: ChalkForm): void {
    this.setState({form})
  }

  updateAdmin(admin: AdminProps): void {
    this.setState({admin})
  }

  async submit() {
    console.log(this.state.form)
    const chalk = chalkFormToRecord(this.state.form)
    console.log(chalk)
    const queryString: string = new URLSearchParams(chalk).toString()
    console.log(queryString)
    const response: ChalkboardRow[] = await fetch("/chalkboards?" + queryString).then(res => res.json())
  }

  render() {
    switch (this.state.page) {
      case "form":
        return <Form form={this.state.form} update={this.updateForm.bind(this)} submit={this.submit.bind(this)}/>
      case "table":
        return <Table rows={this.state.table}/>
      default:
        return <div></div>
    }
  }

}

ReactDOM.render(<Main/>, document.getElementById("main"))
