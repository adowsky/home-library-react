import React from "react";

import Login from "./Login";
import Register from "./Register";

export default class LoginOrRegister extends React.Component {
    render() {
        return (
            <div>
                <Login/>
                <Register/>
            </div>
        );
    }
}
