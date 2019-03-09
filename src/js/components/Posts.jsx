import React, { Component } from "react";
import { connect } from "react-redux";
import { getData } from "../actions/index";

export class Post extends Component {
    componentDidMount() {
        this.props.getData();
    }
    render() {
        return (
            <ul className="list-group list-group-flush">
                {this.props.entities.map(el => (
                    <li className="list-group-item" key={el.id}>
                        {el.title}
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
)(Post);
