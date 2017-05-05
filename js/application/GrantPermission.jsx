import React from 'react';
import PropTypes from "prop-types";

export default class extends React.Component {
    static contextTypes = {
        restClient: PropTypes.object
    };

    constructor(...props) {
        super(...props);

        this.state = {
            granting: false,
            email: null
        }
    }

    onGrant(event) {
        event.preventDefault();
        this.setState({ granting: true })
    }

    handle(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    reject(event) {
        event.preventDefault();
        this.setState({ granting: false });
    }

    grantAccess(event) {
        event.preventDefault();
        this.context.restClient.postRequestNoBody("/api/libraries/permissions", { grantedEmail: this.state.email })
            .then(() => this.setState({ granting: false }));

    }

    render() {
        return (
            (this.state.granting) ?
            <form onSubmit={ this.grantAccess.bind(this) } className="grant" >
                <input name="email" placeholder="email" value={ this.state.email || "" } onChange={ this.handle.bind(this) }/>
                <input value="Accept" type="submit" />
                <a href="#" onClick={ this.reject.bind(this) } >Reject</a>
            </form> :
                <a href="#" onClick={ this.onGrant.bind(this) } >Grant access to your library</a>

        );
    }
}
