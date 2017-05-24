import React from "react";
import PropTypes from "prop-types";

export default class Statistics extends React.Component {
    static contextTypes = {
        readingBooks: PropTypes.array,
        restClient: PropTypes.object
    };

    constructor(...props) {
        super(...props);

        this.state = {
            average: 0,
            lastBook: null,
            borrowedBooks: [],
            booksOutsideLibrary: []
        }
    }

    componentDidMount() {
        this.context.restClient.getRequest(`/api/users/statistics`)
            .then((stats) => this.setState(stats))
    }


    render() {
        return (
            <section className="stats">
                <div>
                    <h2>You are currently reading following books:</h2>
                    <span>
                        { (this.context.readingBooks.length > 0) ?
                            this.context.readingBooks.map(book => `${book.author}: "${book.title}", `) :
                            "There is no book you are reading now" }
                        </span>
                </div>
                <div>
                    <h2>Last finished book:</h2>
                    <span>
                        { (this.state.lastBook) ? `${this.state.lastBook.author}: "${this.state.lastBook.title}"` :
                            "You haven't finished any book yet" }
                        </span>


                </div>
                <div>
                    <h2>Your speed of reading:</h2>
                    <span>
                        { `${this.state.average} per month` }
                        </span>
                </div>
                <div>
                    <h2>Borrowed books:</h2>
                    <span>
                        { this.state.borrowedBooks.reduce((total, current) => `${total}, ${current.libraryBook.author}-${current.libraryBook.title}`,
                            "") }
                        </span>
                </div>
                <div>
                    <h2>Books borrowed form you:</h2>
                    <span>
                        { this.state.booksOutsideLibrary.reduce((total, current) => `<0>total</0>   ${current.author}-${current.title},`,
                            "") }
                        </span>
                </div>
            </section>
        );
    }
}