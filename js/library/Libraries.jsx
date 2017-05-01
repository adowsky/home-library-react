import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

export default class Libraries extends React.Component {
    static contextTypes = {
        restClient: PropTypes.object
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
            .catch(() => this.props.history.push({ pathname: '/' }));
    }

    render() {
        return (
            <ul>
                { this.state.availableLibraries
                    .map(lib => <li key={lib}><Link to={`library/${lib}`}>{ lib }</Link></li>) }
            </ul>
        );
    }
}
