import React from 'react';
import PropTypes from "prop-types";

import { parseQueryParams } from "../UrlUtils";

export default class Confirm extends React.Component {
    static contextTypes = {
        restClient: PropTypes.object
    };

    constructor(...props) {
        super(...props);

    }

    componentDidMount() {
        const params = parseQueryParams(this.props.location.search);
        if(params.code) {
            this.context.restClient.postRequestNoBody(`/api/users/confirmation?confirm=${params.code}`)
                .then(() => this.props.history.push("/login"));
        }
    }

    render() {
        return (
            <section>
                <p>Processing your confirmation...</p>
            </section>

        );
    }
}
