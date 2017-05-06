import React from 'react';
import PropTypes from 'prop-types';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import localForage from "localforage";

import RestClient from "./RestClient";
import MenuView from "./MenuView";
import ApplicationView from "./ApplicationView";
import LoadingView from "./LoadingView";
import Login from "../login/Login";
import Confirm from "../login/Confirm";
import Register from "../login/Register";
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
        path: "/register",
        component: Register
    },
    {
        path: "/registered",
        component: RegisteredView
    },
    {
        path: "/confirm",
        component: Confirm
    }
];

export default class Application extends React.Component {
    static childContextTypes = {
        restClient: PropTypes.object,
        onLogIn: PropTypes.func,
        onLogOut: PropTypes.func,
        onAuthorizationFail: PropTypes.func,
        username: PropTypes.string,
        readingBooks: PropTypes.array,
        readingBooksIds: PropTypes.array,
        refreshReadings: PropTypes.func,
        notificationQueue: PropTypes.object
    };

    constructor(...props) {
        super(...props);
        this.restClient = new RestClient();
        this.state = {
            username: null,
            readingBooks: [],
            loaded: false

        };

        this.onLogout = () => {
            localForage.setItem("authorization", null);
            this.restClient.setToken(null);
            this.flushAuth();
        };

        this.logIn = this.logIn.bind(this);
        this.logout = this.logout.bind(this);
        this.flushAuth = this.flushAuth.bind(this);
        this.refreshReadings = this.refreshReadings.bind(this);
    }

    componentDidMount() {
        localForage.getItem("authorization")
            .then(auth => {
                if (auth) {
                    const authorization = JSON.parse(auth);
                    this.restClient.setToken(authorization.accessToken);
                    console.debug(`Found access token: ${auth}`);
                    return authorization.username;
                }
            })
            .then(this.logIn)
            .then(() => this.setState({ loaded: true }))
            .catch(() => this.setState({ loaded: true }))
    }


    getChildContext() {
        return {
            restClient: this.restClient,
            username: this.state.username,
            readingBooks: this.state.readingBooks,
            readingBooksIds: this.state.readingBooks.map(book => book.id),
            refreshReadings: this.refreshReadings,
            onLogIn: this.logIn,
            onAuthorizationFail: this.flushAuth,
            onLogOut: this.logout
        };
    }

    logIn(username) {
        this.setState({ username });
        return this.afterLogin();
    }

    logout() {


        this.restClient.deleteRequest(`/api/authorize`, {})
            .then(this.onLogout)
            .catch(this.onLogout)
    }

    afterLogin() {
        return this.restClient.getRequest(`/api/readings`)
            .then(readingBooks => this.setState({ readingBooks }))
            .catch(this.onLogout);
    }

    refreshReadings() {
        this.restClient.getRequest(`/api/readings`)
            .then(readingBooks => this.setState({ readingBooks }));
    }

    flushAuth() {
        localForage.setItem("authorization", null);
        this.restClient.setToken(null);
        return this.setState({ username: null });
    }

    render() {
        const rootRender = () => (this.state.username) ? <Redirect from="/" to="/library"/> :
            <Redirect from="/" to="/login"/>;
        const routes = (this.state.username) ? routesForLogged : routesForAnon;
        return (
            <Router>
            <ApplicationView>
                { (this.state.loaded && this.state.username) ? <MenuView /> : null }
                { (this.state.loaded) ?

                        <Switch>
                            <Route exact path='/' render={ rootRender }/>
                            <Route exact path='/logout' render={ () => {
                                this.logout();
                                return <Redirect from="/logout" to="/login"/>
                            } }/>
                            { routes.map(route => <Route key={route.path} exact path={route.path}
                                                         component={ route.component }/>) }
                            <Route exact path='/*' render={ rootRender }/>
                        </Switch>
                     :
                    <LoadingView/>
                }
            </ApplicationView>
            </Router>
        );
    }
}
