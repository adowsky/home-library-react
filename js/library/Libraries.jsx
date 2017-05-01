import React from "react";
import PropTypes from "prop-types";

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
            .then(response => this.setState({ availableLibraries: response }));
    }

    render() {
        return (
            <div></div>
        );
    }

}