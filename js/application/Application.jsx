import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import RestClient from "./RestClient";
import ApplicationView from "./ApplicationView";
import Login from "../login/Login";
import Libraries from "../library/Libraries";
import UserLibrary from "../library/UserLibrary";
import Book from "../library/Book";

export default class Application extends React.Component {
    static childContextTypes = {
        restClient: React.PropTypes.any
    };

    constructor(props) {
        super(props);
        this.restClient = new RestClient();
        console.log("Mounting app");
    }


    getChildContext() {
        return {
            restClient: this.restClient
        };
    }


    render() {
        return (
            <ApplicationView>

                <Router>
                    <div className="root">
                        <Switch>
                            <Route exact path='/login' component={ Login }/>
                            <Route exact path='/library/' component={ Libraries }/>
                            <Route exact path='/library/:username' component={ UserLibrary }/>
                            <Route exact path='/book/:bookId' component={ Book }/>
                            <Route exact path='/*' component={ Libraries }/>
                        </Switch>
                    </div>
                </Router>

            </ApplicationView>
        );
    }
}
