import React from "react";

export default class Book extends React.Component {

    render() {
        const { id, author, title, borrowed } = this.props.book;
        return (
            <div>
                { (this.props.add) ?
                    <div>
                        <input name="author" placeholder="author" value={ author || "" } onChange={this.props.handle}/>
                        <input name="title" placeholder="title" value={ title || "" } onChange={this.props.handle}/>
                        <button onClick={ this.props.add }>Add</button>
                        <button onClick={ this.props.reject }>Reject</button>
                    </div> : <div>
                        <span>{ author }</span>
                        <span>{ title }</span>
                    </div> }
            </div>
        );
    }
}