import React from 'react';
import { Link } from "react-router-dom";

export default class extends React.Component {
    render() {
        return (
            <nav>
                <ul>
                    <li><Link to="/libraries">Available libraries</Link></li>
                    <li><Link to="/logout">Logout</Link></li>
                </ul>
            </nav>

        );
    }
}
