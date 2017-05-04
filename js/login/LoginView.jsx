import React from "react";

export default class LoginView extends React.Component {


    render() {
        return (
            <div className="login-form">
                <header>
                    <h2 className="emphasised">Log in</h2>
                </header>
                <input name="login" type="text" placeholder="Login" onChange={ this.props.handle } value={ this.props.form.login || "" }/>
                <input name="password" type="password" placeholder="Password" onChange={ this.props.handle } value={ this.props.form.password || "" }/>
                <button onClick={ this.props.login }>Log in</button>
            </div>
        );
    }
}
