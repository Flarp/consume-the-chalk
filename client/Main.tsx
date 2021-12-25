import React from "react"
import ReactDOM from "react-dom"

import { ChalkForm, AdminProps, ChalkboardRow } from "./utils"

import { Form } from "./pages/Form"
import { Table } from "./pages/Table"
import { Admin } from "./pages/Admin"

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

    // get days
    ["days", form.days.toString()],

    // parse arrays and sets
    ...Object.entries(form)
      .filter(([_, val]) => typeof val !== "string")
      .map(([key, value]: [string, string[] | Set<string>]) => Array.from(value).map(vVal => [key, vVal]))
      .flat()
  ]
}

class Main extends React.Component<{}, MainState> {
  state: MainState = {
    page: "form",
    form: {
      width: new Set(),
      panels: [1, 4],
      color: new Set(),
      times: ["now", "now"],
      days: (1 << (((new Date()).getDay() + 6) % 7)) & 63
    },
    table: [],
    admin: {
      key: "",
      currIndex: -1,
    }
  }

  updateForm(form: ChalkForm): void {
    this.setState({form})
  }

  updateAdmin(table: ChalkboardRow[], admin: AdminProps): void {
    this.setState({table, admin})
  }

  async submit() {
    const chalk = chalkFormToRecord(this.state.form)
    const queryString: string = new URLSearchParams(chalk).toString()
    const response: ChalkboardRow[] = await fetch("/chalkboards?" + queryString).then(res => res.json())
    this.setState({ page: "table", table: response })
  }

  async loadAdmin() {
    const response: ChalkboardRow[] = await fetch("/admin").then(res => res.json())
    this.setState({ page: "admin", table: response })
  }

  async adminSubmit() {

  }

  render() {
    switch (this.state.page) {
      case "form":
        return <Form
          form={this.state.form}
          update={this.updateForm.bind(this)}
          submit={this.submit.bind(this)}
          admin={this.loadAdmin.bind(this)}/>
      case "table":
        return <Table rows={this.state.table} ret={this.setState.bind(this, {page: "form"})}/>
      case "admin":
        return <Admin
          rows={this.state.table}
          admin={this.state.admin}
          update={this.updateAdmin.bind(this)}
          submit={this.adminSubmit.bind(this)}
          ret={this.setState.bind(this, {page: "form"})}/>
    }
  }

}

ReactDOM.render(<Main/>, document.getElementById("main"))
