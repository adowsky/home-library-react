import React from "react";
import PropTypes from "prop-types";

export default class Book extends React.Component {
    static contextTypes = {
        restClient: PropTypes.object
    };

    constructor(...props) {
        super(...props);
    }


    render() {
        const { author, title } = this.props.book;
        const { handle } = this.props;

        return (
            <div>
                <span>
                    <input name="author" placeholder="author" value={ author || "" } onChange={ handle }/>
                </span>
                <span>
                    <input name="title" placeholder="title" value={ title || "" } onChange={ handle }/>
                </span>
                <span className="v-padded">
                        <ul>
                            <li><a onClick={ this.props.add } href="#">Add</a></li>
                            <li><a onClick={ this.props.reject } href="#">Reject</a></li>
                        </ul>
                </span>
            </div>
        );
    }
}