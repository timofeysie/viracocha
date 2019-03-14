import React, { Component } from "react";
import { connect } from "react-redux";
import { getData } from "../actions/index";
import { selectEntity } from "../actions/index";

export class Entities extends Component {

    handleClick(entity) {
      this.props.selectEntity(entity);
      selectEntity(entity);
    }

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
                    <li onClick={() => this.handleClick(el)}
                      className="list-group-item"
                      key={el.cognitive_bias}>
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

const mapDispatchToProps = dispatch => ({
  onClick: event => dispatch(selectEntity(event)) // <-- manually dispatches
})


export default connect(
    mapStateToProps,
    { getData, selectEntity }
)(Entities);
