import React,{ Component } from "react";
import "./Test.css";
import { Grid, Col, Row, Button, FormGroup, FormControl, ControlLabel, Checkbox, SplitButton, MenuItem, DropdownButton } from "react-bootstrap";
import Select from 'react-select';

class Test extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      names: [{
        "name":"John",
        "name":"Mari",
        "name":"Daze",
        "name":"Nandy",
      }],
  
    };

    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  handleOptionChange(event) {
    this.setState({name: event.target.value});
  }

  componentDidMount(){
  }


  render() {
    // let options = this.state.names.map(function (key) {
    //   return {value: key.name, label: key.name};
    // })

    const options = [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' }
    ]
    
    return (
      <div className="Data_Class">
        <div class="container">
            <Select
                name="name"
                // value={this.state.value}
                // options={names.map(this.renderNames)}
                options={options}
                // onChange={this.handleOptionChange}
            />
         </div>
        </div>
    )
  }
}

export default Test