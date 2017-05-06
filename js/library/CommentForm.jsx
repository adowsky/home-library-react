import React from "react";

export default class extends React.Component {
    render() {
        return (
            <div className="comment-form">
                <form onSubmit={ this.props.addComment }>
                    <textarea rows="3" value={ this.props.comment } onChange={ this.props.handle } placeholder="comment"/>
                    <input type="submit" value="submit"/>
                </form>
            </div>
        );
    }
}