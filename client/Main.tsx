import React from "react"
import ReactDOM from "react-dom"
import { RSAKey, KEYUTIL, KJUR } from "jsrsasign"

import { ChalkForm, AdminProps, ChalkboardRow } from "./utils"

import { Form } from "./pages/Form"
import { Table } from "./pages/Table"
import { Admin } from "./pages/Admin"

interface MainState {
  page: "form" | "table" | "admin",
  form: ChalkForm,
  admin: AdminProps,
  table: ChalkboardRow[]
}

function chalkFormToRecord(form: ChalkForm): string[][] {
  const entries = Object.entries(form)
  return [
    // get normal string pairs
    ...entries
      .filter(([_, val]) => typeof val === "string"),

    // get number pairs
    ...entries
      .filter(([_, val]) => typeof val === "number")
      .map(([key, value]: [string, number]) => [key, value.toString()]),

    // parse arrays and sets
    ...entries
      .filter(([_, val]) => typeof val !== "string" && typeof val !== "number")
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
      days: (1 << (((new Date()).getDay() + 6) % 7)) & 63,
      number: 1
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

  updateAdmin(table: ChalkboardRow[], admin: AdminProps): Promise<void> {
    //console.log(table, admin, "there's no way this is working")
    return new Promise((res, rej) => this.setState({table, admin}, res))
  }

  async submit() {
    const chalk = chalkFormToRecord(this.state.form)
    const queryString: string = new URLSearchParams(chalk).toString()
    const response: ChalkboardRow[] = await fetch("/chalkboards?" + queryString).then(res => res.json())
    this.setState({ page: "table", table: response })
  }

  async loadAdmin(rows?: ChalkboardRow[]) {
    const response: ChalkboardRow[] = Array.isArray(rows)
      ? rows
      : await fetch("/admin").then(res => res.json())
    console.log(response)
    return this.setState({ page: "admin", table: response })
  }

  async adminSubmit(operation: "update" | "delete" | "add", row: ChalkboardRow) {
    let signature = ""
    if (this.state.admin.key !== "") {
      const rsa = new KJUR.crypto.Signature({"alg": "SHA1withRSA"});
      rsa.init(this.state.admin.key)
      rsa.updateString(JSON.stringify(row))
      signature = rsa.sign()
    }
    const updated = await fetch("/admin", {
      method: "POST",
      body: JSON.stringify({row, signature, operation}),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
    this.loadAdmin(updated)
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
          ret={this.setState.bind(this, {page: "form", admin: {currIndex: -1}})}/>
    }
  }

}

ReactDOM.render(<Main/>, document.getElementById("main"))
