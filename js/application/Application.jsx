import React from 'react';
import PropTypes from 'prop-types';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import localForage from "localforage";

import RestClient from "./RestClient";
import ApplicationView from "./ApplicationView";
import Login from "../login/Login";
import Libraries from "../library/Libraries";
import UserLibrary from "../library/UserLibrary";
import Book from "../library/Book";

export default class Application extends React.Component {
    static childContextTypes = {
        restClient: PropTypes.object,
        onLogIn: PropTypes.func,
        onLogOut: PropTypes.func,
        loggedIn: PropTypes.bool
    };

    constructor(...props) {
        super(...props);
        this.restClient = new RestClient();
        this.state = {
            loggedId: false
        };

        this.logIn = this.logIn.bind(this);
    }


    getChildContext() {
        return {
            restClient: this.restClient,
            loggedIn: this.state.loggedId,
            onLogIn: this.logIn,
            onLogOut: () => {
                this.setState({ loggedId: false });
                this.forceUpdate();
            }
        };
    }

    logIn() {
        return this.setState({ loggedId: true });
    }


    render() {
        const rootRender = () => (this.state.loggedId) ? <Redirect to="/library"/> : <Redirect to="/login"/>;
        return (
            <ApplicationView>
                <Router >
                    <Switch>
                        <Route exact path='/' render={ rootRender }/>
                        <Route exact path='/login' component={ Login }/>
                        <Route exact path='/library' component={ Libraries }/>
                        <Route exact path='/library/:username' component={ UserLibrary }/>
                        <Route exact path='/book/:bookId' component={ Book }/>
                        <Route exact path='/*' component={ Libraries }/>
                    </Switch>
                </Router>

            </ApplicationView>
        );
    }
}
