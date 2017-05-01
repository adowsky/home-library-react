import React from "react";

export default class Book extends React.Component {
    render() {
        const {id, author, title, borrowed} = this.props.book;
        return (
            <div>
                <span>{ author }</span>
                <span>{ title }</span>
            </div>
        );
    }

}