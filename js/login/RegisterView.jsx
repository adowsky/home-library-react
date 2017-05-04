import React from "react";

export default class LoginView extends React.Component {
    render() {
        return (
            <div className="register-form">
                <header>
                    <h2 className="emphasised">Or register</h2>
                </header>
                <input name="username" type="text" placeholder="Login" onChange={ this.props.handle } value={ this.props.form.username || "" }/>
                <input name="passwordHash" type="password" placeholder="Password" onChange={ this.props.handle } value={ this.props.form.passwordHash || "" }/>
                <input name="firstName" type="text" placeholder="First name" onChange={ this.props.handle } value={ this.props.form.firstName || "" }/>
                <input name="lastName" type="text" placeholder="Surname" onChange={ this.props.handle } value={ this.props.form.lastName || "" }/>
                <input name="email" type="text" placeholder="email" onChange={ this.props.handle } value={ this.props.form.email || "" }/>
                <button onClick={ this.props.register }>Register</button>
            </div>
        );
    }
}
