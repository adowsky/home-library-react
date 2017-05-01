import React from 'react';
import PropTypes from 'prop-types';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import localForage from "localforage";

import RestClient from "./RestClient";
import ApplicationView from "./ApplicationView";
import Login from "../login/Login";
import Libraries from "../library/Libraries";
import UserLibrary from "../library/UserLibrary";
import RegisteredView from "../static/RegisteredView";
import Book from "../library/Book";

const routesForLogged = [
    {
        path: "/library",
        component: Libraries
    },
    {
        path: "/library/:username",
        component: UserLibrary
    },
    {
        path: "/book/:bookId",
        component: Book
    }
];

const routesForAnon = [
    {
        path: "/login",
        component: Login
    },
    {
        path: "/registered",
        component: RegisteredView
    }
];

export default class Application extends React.Component {
    static childContextTypes = {
        restClient: PropTypes.object,
        onLogIn: PropTypes.func,
        onLogOut: PropTypes.func,
        onAuthorizationFail: PropTypes.func,
        loggedIn: PropTypes.bool
    };

    constructor(...props) {
        super(...props);
        this.restClient = new RestClient();
        this.state = {
            loggedId: false
        };

        this.logIn = this.logIn.bind(this);
        this.flushAuth = this.flushAuth.bind(this);
    }

    componentDidMount() {
        localForage.getItem("authorization")
            .then(auth => {
                if (auth) {
                    this.restClient.setToken(JSON.parse(auth).accessToken);
                    this.logIn();
                }
            })
    }


    getChildContext() {
        return {
            restClient: this.restClient,
            loggedIn: this.state.loggedId,
            onLogIn: this.logIn,
            onAuthorizationFail: this.flushAuth,
            onLogOut: () => {
                this.setState({ loggedId: false });
                this.forceUpdate();
            }
        };
    }

    logIn() {
        return this.setState({ loggedId: true });
    }

    flushAuth() {
        localForage.setItem("authorization", null);
        this.restClient.setToken(null);
        return this.setState({ loggedId: false });
    }

    render() {
        const rootRender = () => (this.state.loggedId) ? <Redirect from="/" to="/library"/> : <Redirect from="/" to="/login"/>;
        const routes = (this.state.loggedId) ? routesForLogged : routesForAnon;
        return (
            <ApplicationView>
                <Router>
                    <Switch>
                        <Route exact path='/' render={ rootRender }/>
                        { routes.map(route => <Route key={route.path} exact path={route.path}
                                                     component={ route.component }/>) }
                        <Route exact path='/*' render={ rootRender }/>
                    </Switch>
                </Router>
            </ApplicationView>
        );
    }
}
