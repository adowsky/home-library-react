import React from "react";

export default class Book extends React.Component {
    onBorrow(event) {
        event.preventDefault();
        const borrower = this.props.book.borrowedBy;
        const mode = (!borrower || 0 === borrower.length) ? "BORROW" : "RETURN";
        this.props.borrow(this.props.book.id, mode);
    }

    onAnonBorrow(event) {
        event.preventDefault();
        const borrower = this.props.book.borrowedBy;
        const mode = (!borrower || 0 === borrower.length) ? "BORROW" : "RETURN";
        this.props.borrow(this.props.book.id, mode, true);
    }

    render() {
        const { id, author, title, borrowedBy } = this.props.book;
        const { markReading, showBorrower, showBorrow, borrowToAnon, reading, handle  } = this.props;
        return (
            <div>
                { (this.props.add) ?
                    <div>
                        <input name="author" placeholder="author" value={ author || "" } onChange={ handle }/>
                        <input name="title" placeholder="title" value={ title || "" } onChange={ handle }/>
                        <button onClick={ this.props.add }>Add</button>
                        <button onClick={ this.props.reject }>Reject</button>
                    </div> : <div>
                        <span>{ author }</span>
                        <span>{ title }</span>
                        { (showBorrower && borrowedBy) ? <span>Borrowed by: { borrowedBy }</span> : null }
                        { (showBorrow) ? <button onClick={ this.onBorrow.bind(this) }>{ (borrowedBy) ? 'Return' : 'Borrow' }</button> : null }
                        { (showBorrow && borrowToAnon && "" === borrowedBy) ? <button onClick={ this.onAnonBorrow.bind(this) }>Borrow outside system</button> : null }
                        { reading ?
                            <button onClick={ () => markReading(false, id) }>Unmark reading</button>:
                            <button onClick={ () => markReading(true, id) }>Mark as reading</button> }
                    </div> }
            </div>
        );
    }
}