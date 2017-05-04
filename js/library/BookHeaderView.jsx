import React from "react";

export default class BookHeaderView extends React.Component {
    render() {
        return (
            <div>
                <header>
                    <h2 className="emphasised v-spaced">{`${this.props.owner}'s Library`}</h2>
                </header>
                <div>
                    <a href="#" onClick={this.props.add}>Add book</a>
                </div>
            </div>
        );
    }

}