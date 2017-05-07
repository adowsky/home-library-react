import React from 'react';
import { Link } from "react-router-dom";

import GrantPermission from "./GrantPermission";

export default class MenuView extends React.Component {
    render() {
        return (
            <div className="header menu">
                <div className="permission">
                    <GrantPermission/>
                </div>

                <nav>
                    <ul>
                        <li><Link to="/libraries">Available libraries</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </nav>
            </div>

        );
    }
}
