import React from "react";
import PropTypes from "prop-types";

export default class BookDetails extends React.Component {
    static contextTypes = {
        restClient: PropTypes.object
    };

    constructor(...props) {
        super(...props);
        this.state = {
            author: "",
            title: "",
            comments: [],
            borrows: []
        }
    }

    componentDidMount() {
        const { bookId } = this.props.match.params;
        this.context.restClient.getRequest(`/api/books/${bookId}`)
            .then(response => this.setState(response))
    }

    render() {
        return (
            <article className="book-details">
                <header>
                    <h2>{ `${this.state.author} - "${this.state.title}"` }</h2>
                </header>
                <section>
                    <header>
                        <h2>Comments</h2>
                    </header>
                    {(this.state.comments.length === 0) ?
                        <div className="comment">
                            <span>This book don't have any comment.</span>
                        </div> : null
                    }
                    { this.state.comments.map((comment, key) =>
                        <div className="comment" key={ key } >
                            <span>{ comment.comment }</span>
                            <span>{ `by ${comment.authorUsername}` }</span>
                        </div>) }
                </section>
                <section>
                    <header>
                        <h2>Borrow history</h2>
                    </header>
                    <table className="display-table">
                        <thead>
                        <tr>
                            <th>Who</th>
                            <th>Borrow date</th>
                            <th>Return date</th>
                        </tr>
                        </thead>
                        <tbody>
                        { this.state.borrows.map((borrow, index )=>
                            <tr key={ index }>
                                <th>{ borrow.borrower }</th>
                                <th>{ new Date(borrow.borrowDate).toLocaleString() }</th>
                                <th>{ (borrow.returnDate) ? new Date(borrow.returnDate).toLocaleString() : "not returned yet" }</th>
                            </tr>)
                        }
                        </tbody>
                    </table>
                </section>
            </article>
        );
    }
}