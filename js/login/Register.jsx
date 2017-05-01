import React from "react";
import PropTypes from "prop-types";
import localForage from "localforage";


import RegisterView from "./RegisterView";

export default class Register extends React.Component {
    static contextTypes = {
        restClient: PropTypes.object,
        onLogIn: PropTypes.func,
        loggedIn: PropTypes.bool
    };

    constructor(...props) {
        super(...props);

        this.state = {
            form: {
                username: "",
                passwordHash: "",
                firstName: "",
                lastName: "",
                email: "",
            }

        };

        this.handle = this.handle.bind(this);
        this.register = this.register.bind(this);
    }

    componentDidUpdate() {
        if(this.context.loggedIn) {
            this.props.history.push({ pathname: '/' });
        }
    }

    register() {
        this.context.restClient.postRequestNoBody(`/api/users`, this.state.form)
            .then(() => this.props.history.push({ pathname: '/registered' }));
    }

    handle(event) {
        const { name, value } = event.target;

        const form = Object.assign({}, this.state.form, { [name]: value });
        this.setState({ form });
    }

    render() {
        return (
            <RegisterView handle={ this.handle } form={ this.state.form } register={ this.register }/>
        );
    }
}
