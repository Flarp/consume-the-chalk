import React from "react"

import { ChalkForm, Color, Width } from "../types"

interface Props {
  form: ChalkForm,
  update(state: ChalkForm): void,
  submit(): void,
}

export class Form extends React.Component<Props> {
  render() {
    const colors: Color[] = ["green", "black", "brown"]
    const widths: Width[] = ["normal", "wide", "extra wide"]
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

      <br/>
      <label htmlFor="color">Chalkboard Color</label>
      <fieldset id="color">
        {colors.map(color => <div>
          <label htmlFor={color.toLowerCase()}>{color}</label>
          <input type="checkbox" id={color.toLowerCase()} checked={this.props.form.color.has(color)} onChange={e => {
            if (e.target.checked) {
              this.props.form.color.add(color)
            } else {
              this.props.form.color.delete(color)
            }
            this.props.update(this.props.form)
          }}/>
        </div>)}
      </fieldset>

      <br/>
      <label htmlFor="width">Chalkboard Width</label>
      <fieldset id="width">
        {widths.map(width => <div>
          <label htmlFor={width.toLowerCase()}>{width}</label>
          <input type="checkbox" id={width.toLowerCase()} checked={this.props.form.width.has(width)} onChange={e => {
            if (e.target.checked) {
              this.props.form.width.add(width)
            } else {
              this.props.form.width.delete(width)
            }
            this.props.update(this.props.form)
          }}/>
        </div>)}
      </fieldset>

      <input type="submit" id="submit" onClick={e => {
        e.preventDefault()
        this.props.submit()
      }}/>
    </form>)
  }
}
