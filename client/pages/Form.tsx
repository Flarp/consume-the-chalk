import React from "react"

import { ChalkForm } from "../types"

interface Props {
  form: ChalkForm,
  update(state: ChalkForm): void,
  submit(): void,
}

export class Form extends React.Component<Props> {
  render() {
    return (<form>
      <label htmlFor="panels">Panels</label>
      <input type="number" id="panelsLow" value={this.props.form.panelLow} onChange={e => {
        this.props.form.panelLow = Number(e.target.value)
        this.props.update(this.props.form)
      }}/>

      <label htmlFor="panelsHigh">to</label>
      <input type="number" disabled={!this.props.form.range} id="panelsHigh" value={this.props.form.range ? this.props.form.panelHigh : this.props.form.panelLow}/>

      <input type="checkbox" id="range" onChange={e => {
        this.props.form.range = e.target.checked
        this.props.update(this.props.form)
      }}/>

      <input type="submit" id="submit" onClick={e => {
        e.preventDefault()
        this.props.submit()
      }}/>
    </form>)
  }
}
