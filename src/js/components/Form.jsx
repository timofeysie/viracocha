// src/js/components/Form.jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import uuidv1 from "uuid";

import { addEntity } from "../actions/index";

function mapDispatchToProps(dispatch) {
    return {
        addEntity: entity => dispatch(addEntity(entity))
    };
}

class ConnectedForm extends Component {
    constructor() {
        super();
        this.state = {
            cognitive_biasLabel: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        this.setState({ cognitive_biasLabel: event.target.value });
    }
    handleSubmit(event) {
        event.preventDefault();
        const { cognitive_biasLabel } = this.state;
        const cognitive_bias = uuidv1();
        this.props.addEntity({ cognitive_biasLabel, cognitive_bias });
        this.setState({ cognitive_biasLabel: "" });
    }
    render() {
        const { cognitive_biasLabel } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="label">Label</label>
                    <input
                        type="text"
                        className="form-control"
                        id="label"
                        value={cognitive_biasLabel}
                        onChange={this.handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-success btn-lg">
                    SAVE
                </button>
            </form>
        );
    }
}

const Form = connect(null, mapDispatchToProps)(ConnectedForm);

export default Form;
