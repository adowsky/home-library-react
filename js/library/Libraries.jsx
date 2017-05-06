import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Statistics from "./Statistics";

export default class Libraries extends React.Component {
    static contextTypes = {
        restClient: PropTypes.object,
        onAuthorizationFail: PropTypes.func
    };

    constructor(...props) {
        super(...props);

        this.state = {
            availableLibraries: []
        }
    }

    componentDidMount() {
        this.context.restClient.getRequest(`/api/libraries`)
            .then(response => this.setState({ availableLibraries: response }))
            .catch(this.context.onAuthorizationFail);
    }

    render() {
        return (
            <div className="libraries">
                <Statistics />

                <header>
                    <h2 className="emphasised v-spaced">Available libraries</h2>
                </header>
                <ul>
                    { this.state.availableLibraries
                        .map(lib => <li key={lib}><Link className="button-link" to={`library/${lib}`}>{ lib }</Link></li>) }
                </ul>
            </div>
        );
    }
}
