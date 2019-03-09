import React from "react";
import { connect } from "react-redux";

const mapStateToProps = state => {
    return { entities: state.entities };
};

const ConnectedList = ({ entities }) => (
    <ul className="list-group list-group-flush">
        {entities.map(el => (
            <li className="list-group-item" key={el.cognitive_bias}>
                {el.cognitive_biasLabel}
            </li>
        ))}
    </ul>
);

const List = connect(mapStateToProps)(ConnectedList);

export default List;
