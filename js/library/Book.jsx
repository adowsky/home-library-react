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
        const { showBorrower, showBorrow, borrowToAnon, reading, handle, owner } = this.props;
        const markReading = (event) => {
            event.preventDefault();
            this.props.markReading(!reading, id);
        };
        return (
            <tr>
                <th>
                    { (this.props.add) ? <input name="author" placeholder="author" value={ author || "" }
                                                onChange={ handle }/> : author }
                </th>
                <th>
                    { (this.props.add) ?
                        <input name="title" placeholder="title" value={ title || "" } onChange={ handle }/> : title }
                </th>
                <th className="v-padded">
                    {(this.props.add) ?
                        <ul>
                            <li><a onClick={ this.props.add } href="#">Add</a></li>
                            <li><a onClick={ this.props.reject } href="#">Reject</a></li>
                        </ul>
                        : <ul>
                            { (showBorrower && borrowedBy) ? <li>Borrowed by: { borrowedBy }</li> : null }
                            { (showBorrow) ?
                                <li><a onClick={ this.onBorrow.bind(this) } href="#">{ (borrowedBy) ? 'Return' : 'Borrow' }</a>
                                </li> : null }
                            { (showBorrow && borrowToAnon && "" === borrowedBy) ?
                                <li><a onClick={ this.onAnonBorrow.bind(this) } href="#">Borrow outside system</a></li> : null }
                            <li>
                                { reading ?
                                    <a onClick={ markReading.bind(this) } href="#">Unmark reading</a> :
                                    <a onClick={ markReading.bind(this) } href="#">Mark as reading</a> }
                            </li>

                        </ul> }
                </th>
            </tr>
        );
    }
}