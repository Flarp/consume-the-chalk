import React from "react"
import { Range } from "rc-slider"
import "rc-slider/assets/index.css"
import { ChalkForm, COLORS, WIDTHS, titlecase } from "../types"

//const Range = Slider.createSliderWithTooltip(Slider.Range)

interface Props {
  form: ChalkForm,
  update(state: ChalkForm): void,
  submit(): void,
}

export class Form extends React.Component<Props> {
  render() {
    const divStyle = {width: "75%"}
    //const colors: Color[] = ["green", "black", "brown"]
    //const widths: Width[] = ["normal", "wide", "extra wide"]
    return (<form>
      {/*
      <label htmlFor="panels">Panels</label>
      <input type="number" id="panelsLow" value={this.props.form.panelLow} onChange={e => {
        this.props.form.panelLow = Number(e.target.value)
        this.props.update(this.props.form)
      }}/>

      <label htmlFor="panelsHigh">to</label>
      <input type="number" disabled={!this.props.form.range} id="panelsHigh" value={this.props.form.range ? this.props.form.panelHigh : this.props.form.panelLow}/>
      */}



      <br/>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", justifyItems: "center"}}>
        <div style={divStyle}>
          <p>Panel count:</p>
          <Range min={1} max={4} marks={["",1,2,3,4]} onChange={(panels: [number, number]) => {
            this.props.form.panels = panels
            this.props.update(this.props.form)
          }}/>
        </div>
        
        <div style={divStyle}>
          <label htmlFor="color">Chalkboard Color</label>
          <fieldset id="color">
            {COLORS.map(color => <div>
              <label htmlFor={color.toLowerCase()}>{titlecase(color)}</label>
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
        </div>

        <div style={divStyle}>
          <label htmlFor="width">Chalkboard Width</label>
          <fieldset id="width">
            {WIDTHS.map(width => <div>
              <label htmlFor={width.toLowerCase()}>{titlecase(width)}</label>
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
        </div>
      </div>

      <input type="submit" id="submit" onClick={e => {
        e.preventDefault()
        this.props.submit()
      }}/>
    </form>)
  }
}
