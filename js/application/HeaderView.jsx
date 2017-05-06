import React from 'react';
import { Link } from "react-router-dom";

export default class HeaderView extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <header>
                <h2><Link to="/">Home Library</Link></h2>
            </header>

        );
    }
}
