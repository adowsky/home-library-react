import React from "react";
import PropTypes from "prop-types";
import localForage from "localforage";


import LoginView from "./LoginView";
import Register from "./Register";

export default class Login extends React.Component {
    static contextTypes = {
        restClient: PropTypes.object,
        onLogIn: PropTypes.func,
        loggedIn: PropTypes.bool
    };

    constructor(...props) {
        super(...props);

        this.state = {
            form: {
                login: "",
                password: ""
            }

        };

        this.handle = this.handle.bind(this);
        this.logIn = this.logIn.bind(this);
    }

    componentDidUpdate() {
        if (this.context.username) {
            this.props.history.push({ pathname: '/' });
        }
    }

    handle(event) {
        const { name, value } = event.target;

        const form = Object.assign({}, this.state.form, { [name]: value });
        this.setState({ form });
    }

    logIn(event) {
        event.preventDefault();
        this.context.restClient.setToken(null);
        const { login, password } = this.state.form;
        this.context.restClient.postRequest(`/api/users/${login}`, { passwordHash: password })
            .then(authorization => {
                authorization.username = login;
                localForage.setItem("authorization", JSON.stringify(authorization));
                this.context.restClient.setToken(authorization.accessToken);
                return login;
            })
            .then(this.context.onLogIn);
    }

    render() {
        return (
            <div>
                <LoginView handle={ this.handle } form={ this.state.form } logIn={ this.logIn }/>
                <Register/>
            </div>
        );
    }
}
