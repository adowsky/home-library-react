import React from "react";

export default class BookHeaderView extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <a href="#" onClick={this.props.add}>+</a>
                </div>

                <header>
                    <span>Author</span>
                    <span>Title</span>
                </header>
            </div>
        );
    }

}