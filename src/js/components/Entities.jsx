import React, { Component } from "react";
import { connect } from "react-redux";
import { getData } from "../actions/index";

export class Entities extends Component {
    componentDidMount() {
        this.props.getData();
    }
    render() {
        let list = [];
        if (typeof this.props.entities[0] !== 'undefined') {
          list = this.props.entities[0].list;
        }
        return (
            <ul className="list-group list-group-flush">
                {list.map(el => (
                    <li className="list-group-item" key={el.cognitive_bias}>
                        {el.cognitive_biasLabel}
                    </li>
                ))}
            </ul>
        );
    }
}

function mapStateToProps(state) {
    return {
        entities: state.remoteEntities.slice(0, 10)
    };
}

export default connect(
    mapStateToProps,
    { getData }
)(Entities);
