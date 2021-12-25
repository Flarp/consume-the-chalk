import React from "react"
import { Range } from "rc-slider"
import "rc-slider/assets/index.css"
import { ChalkForm, COLORS, WIDTHS, DAYS, titlecase } from "../utils"

interface Props {
  form: ChalkForm,
  update(state: ChalkForm): void,
  submit(): void,
  admin(): void
}

interface CheckboxProps {
  items: string[],
  form: ChalkForm,
  property: "color" | "width"
  update(set: ChalkForm): void
}

const InternalCheckBox = (props: CheckboxProps) => <div style={{width: "75%"}}>
  <label>Chalkboard {titlecase(props.property)}</label>
  <fieldset style={{textAlign: "center"}}>
    {props.items.map(item => <span style={{margin: "0.8em"}}>
      <label>{titlecase(item)}</label>
      <input type="checkbox" checked={props.form[props.property].has(item)} onChange={e => {
        if (e.target.checked) {
          props.form[props.property].add(item)
        } else {
          props.form[props.property].delete(item)
        }
        props.update(props.form)
      }}/>
    </span>)}
  </fieldset>
</div>

export class Form extends React.Component<Props> {
  render() {
    return (<form>
      <br/>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", justifyItems: "center"}}>
        <div style={{width: "75%"}}>
          <p>Panel count:</p>
          <Range min={1} max={4} marks={["",1,2,3,4]} onChange={(panels: [number, number]) => {
            this.props.form.panels = panels
            this.props.update(this.props.form)
          }}/>
        </div>

        {[["color", COLORS], ["width", WIDTHS]].map(([property, items]: ["color" | "width", string[]]) =>
          <InternalCheckBox items={items} property={property} form={this.props.form} update={this.props.update}/>
        )}

      </div>

      <br/>

      <p style={{marginBottom: "1em"}}>Days Available</p>
      <div style={{display: "flex", justifyContent: "space-around"}}>
        {DAYS.map((day, i) => <div>
          <label htmlFor={day}>{day}</label>
          <input type="checkbox" checked={(this.props.form.days & (1 << i)) !== 0} onClick={e => {
            this.props.form.days ^= (1 << i)
            console.log(this.props.form.days)
            this.props.update(this.props.form)
          }}/>
        </div>)}
      </div>

      {this.props.form.times.map((time, i) => <div>
        <label htmlFor={`time${i}`}>{i === 0 ? "Start" : "End"} Time</label>
        <input type="time" id={`time${i}`} onChange={e => {
          this.props.form.times[i] = e.target.value
          this.props.update(this.props.form)
        }}/>
      </div>)}

      <input type="submit" id="submit" onClick={e => {
        e.preventDefault()
        this.props.submit()
      }}/>
      <p style={{color: "white"}} onClick={this.props.admin}>See admin panel</p>
    </form>)
  }
}
