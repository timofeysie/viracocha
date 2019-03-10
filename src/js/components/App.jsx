// src/js/components/App.jsx
import React from "react";
import List from "./List.jsx";
import Form from "./Form.jsx";
import Entities from "./Entities.jsx";

const App = () => (
    <div className="row mt-5">
        <div className="col-md-4 offset-md-1">
            <h2>Entities</h2>
            <List />
        </div>
        <div className="col-md-4 offset-md-1">
            <h2>Add a new entity</h2>
            <Form />
        </div>
        <div className="col-md-4 offset-md-1">
            <h2>API entities</h2>
            <Entities />
        </div>
    </div>
);

export default App;
