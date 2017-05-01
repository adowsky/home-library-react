import React from "react";
import PropTypes from "prop-types";
import localForage from "localforage";


import LoginView from "./LoginView";

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
        if(this.context.loggedIn) {
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
        const { login, password } = this.state.form;
        this.context.restClient.postRequest(`/api/users/${login}`, { passwordHash: password })
            .then(authorization => {
                localForage.setItem("authorization", JSON.stringify(authorization));
                this.context.restClient.setToken(authorization.accessToken);
            })
            .then(this.context.onLogIn);
    }

    render() {
        return (
            <LoginView handle={ this.handle } form={ this.state.form } logIn={ this.logIn }/>
        );
    }
}
