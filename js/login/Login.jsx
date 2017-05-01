import React from "react";
import PropTypes from "prop-types";
import localForage from "localforage";


import LoginView from "./LoginView";

export default class Login extends React.Component {
    static contextTypes = {
        restClient: PropTypes.object,
        onLogIn: PropTypes.func
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

    handle(event) {
        const { name, value } = event.target;

        const form = Object.assign({}, this.state.form, { [name]: value });
        this.setState({ form });
    }

    logIn(event) {
        event.preventDefault();
        const { login, password } = this.state.form;
        this.context.restClient.postRequest(`/api/users/${login}`, { passwordHash: password })
            .then(authorization => {
                localForage.setItem("authorization", JSON.stringify(authorization));
                this.context.restClient.setToken(authorization.accessToken);
            })
            .then(this.context.onLogIn)
            .then(() => this.props.history.push({ pathname: '/library' }));
    }

    render() {
        return (
            <LoginView handle={ this.handle } form={ this.state.form } logIn={ this.logIn }/>
        );
    }
}
