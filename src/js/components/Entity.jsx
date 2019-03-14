import React from "react";
import { connect } from "react-redux";

const mapStateToProps = state => {
    return { entity: state.entity };
};

const ConnectedEntity = ({ entity }) => (
    <div className="list-group-item">
        {entity.cognitive_bias}
    </div>
);

const Entity = connect(mapStateToProps)(ConnectedEntity);

export default Entity;
