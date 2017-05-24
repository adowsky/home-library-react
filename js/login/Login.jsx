import React from "react";
import PropTypes from "prop-types";
import localForage from "localforage";

import { sha256 } from "js-sha256";

import LoginView from "./LoginView";
import Register from "./Register";

export default class Login extends React.Component {
    static contextTypes = {
        restClient: PropTypes.object,
        onLogIn: PropTypes.func,
        loggedIn: PropTypes.bool,
        addMessage: PropTypes.func
    };

    constructor(...props) {
        super(...props);

        this.state = {
            form: {
                login: "",
                password: ""
            },
            queryParams: ""
        };

        this.handle = this.handle.bind(this);
        this.login = this.login.bind(this);
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

    login(event) {
        event.preventDefault();
        this.context.restClient.setToken(null);
        const { login } = this.state.form;
        const passwordHash = sha256(this.state.form.password);

        this.context.restClient.postRequest(`/api/authorize`, { passwordHash }, { username: login })
            .then(authorization => {
                authorization.username = login;
                localForage.setItem("authorization", JSON.stringify(authorization));
                this.context.restClient.setToken(authorization.accessToken);
                return login;
            })
            .then(this.context.onLogIn)
            .catch(() => {
                this.context.addMessage("Log in failed. Check your credentials and try again");
            });
    }

    render() {
        return (
            <div className="login">
                <LoginView handle={ this.handle } form={ this.state.form } login={ this.login }/>
                <Register location={ this.props.location } history={ this.props.history } />
            </div>
        );
    }
}
