import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";


import CommentForm from "./CommentForm";

export default class Book extends React.Component {
    static contextTypes = {
        restClient: PropTypes.object
    };

    constructor(...props) {
        super(...props);

        this.state = {
            commenting: false,
            comment: "",
        }
    }

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

    onRequestComment(event) {
        event.preventDefault();
        this.setState({ commenting: !this.state.commenting });
    }

    onAddComment(event) {
        event.preventDefault();
        this.context.restClient.postRequestNoBody(`/api/books/${this.props.book.id}/comments`, { content: this.state.comment })
            .then(() => {
                this.setState({
                    commenting: false,
                    comment: ""
                })
            })
    }

    handle(event) {
        const { value } = event.target;
        this.setState({ comment: value });
    }


    render() {
        const { id, author, title, borrowedBy } = this.props.book;
        const { showBorrower, showBorrow, borrowToAnon, reading, handle } = this.props;
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

                    { this.state.commenting ?
                        <CommentForm
                            handle={ this.handle.bind(this) }
                            comment={ this.state.comment }
                            addComment={ this.onAddComment.bind(this) }/>
                        : null }
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
                                <li><a onClick={ this.onBorrow.bind(this) }
                                       href="#">{ (borrowedBy) ? 'Return' : 'Borrow' }</a>
                                </li> : null }
                            { (showBorrow && borrowToAnon && "" === borrowedBy) ?
                                <li><a onClick={ this.onAnonBorrow.bind(this) } href="#">Borrow outside system</a>
                                </li> : null }
                            <li>
                                { reading ?
                                    <a onClick={ markReading.bind(this) } href="#">Unmark reading</a> :
                                    <a onClick={ markReading.bind(this) } href="#">Mark as reading</a> }
                            </li>
                            <li><Link to={ `/book/${id}` }>Show Details</Link></li>
                            <li>
                                <a onClick={ this.onRequestComment.bind(this) } href="#">
                                    { this.state.commenting ? "Abandon Comment" : "Add Comment" }
                            </a>
                            </li>
                        </ul> }
                </th>
            </tr>
        );
    }
}