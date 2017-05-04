import React from "react";
import PropTypes from "prop-types";

import BookHeaderView from "./BookHeaderView";
import Book from "./Book";

export default class UserLibrary extends React.Component {
    static contextTypes = {
        restClient: PropTypes.object,
        refreshReadings: PropTypes.func,
        username: PropTypes.string,
        readingBooks: PropTypes.array
    };

    constructor(...props) {
        super(...props);
        this.state = {
            library: {
                borrowedBooks: [],
                ownedBooks: []
            },
            addingBook: null,
            errors: {}
        };

        this.onRequestAdd = this.onRequestAdd.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.handle = this.handle.bind(this);
        this.rejectAdd = this.rejectAdd.bind(this);
        this.borrow = this.borrow.bind(this);
        this.validateBook = this.validateBook.bind(this);
    }

    componentDidMount() {
        const { username } = this.props.match.params;
        this.context.restClient.getRequest(`/api/libraries/${username}`)
            .then(library => this.setState({ library }));
    }

    onRequestAdd(event) {
        event.preventDefault();
        console.log("Creating new...");

        this.setState({
            addingBook: {
                title: "",
                author: "",
                adding: false
            }
        });
    }

    onAdd(event) {
        event.preventDefault();
        if(!this.validateBook(this.state.addingBook)) {
            return;
        }
        const { username } = this.props.match.params;
        const { author, title } = this.state.addingBook;
        const addingBook = Object.assign({}, this.state.addingBook, { adding: true });
        this.setState({ addingBook });

        this.context.restClient.postRequest(`/api/libraries/${username}`, {
            author: author,
            title: title
        })
            .then(response => {
                const books = this.state.books.slice(0);
                books.unshift(response);
                this.setState({ books });
            })
            .then(() => this.setState({ addingBook: null }));
    }

    handle(event) {
        const { name, value } = event.target;

        const addingBook = Object.assign({}, this.state.addingBook, { [name]: value });
        this.validateBook(addingBook, [name]);
        this.setState({ addingBook });
    }

    validateBook(book, fields=["title", "author"]) {
        const errors = Object.assign({}, this.state.errors);
        fields.forEach(field => {
            if(book[field].length < 2)
                errors[field] = `${field} is too short`;
            else
                delete errors[field];
        });
        this.setState({ errors });
    }

    rejectAdd(event) {
        event.preventDefault();
        this.setState({
            addingBook: null,
            errors: {}
        });
    }

    borrow(bookId, mode, outside = false) {
        this.context.restClient.postRequestNoBody(`/api/books/${bookId}/borrows`, {
            type: mode,
            outside: outside
        })
            .then(() => {
                const book = this.state.library.ownedBooks.filter(book => book.id === bookId);
                book.borrowedBy = this.context.username;
                this.forceUpdate();
            });
    }

    readingMarking(reading, bookId) {
        const request = {
            date: Date.now().toString()
        };
        request.progression = (reading) ? 'START' : 'END';

        this.context.restClient.postRequestNoBody(`/api/books/${bookId}/reading`, request)
            .then(() => {
                const readingBooks = this.context.readingBooks.slice(0);
                readingBooks.push(bookId);
                console.debug(bookId);
                this.context.refreshReadings();
            });
    }

    render() {
        const showBorrow = this.context.username !== this.props.match.params.username;
        const errors = Object.keys(this.state.errors).map(key => this.state.errors[key]);
        return (
            <div className="user-library">
                <BookHeaderView add={ this.onRequestAdd } owner={ this.props.match.params.username }/>
                <section className="add">
                    <table>
                        <tbody>
                        { (this.state.addingBook) ?
                            <Book book={ this.state.addingBook } add={ this.onAdd } handle={ this.handle }
                                  reject={ this.rejectAdd }/>
                            : null }
                        </tbody>
                    </table>
                    { (errors.length > 0) ?
                        <div className="errors">
                            { errors.map(error => <p>{error}</p>) }
                        </div>
                        : null }
                </section>
                <section>
                    <h2 className="title v-spaced">Books owned by library owner</h2>

                    <table className="display-table">
                        <thead>
                        <tr>
                            <th>Author</th>
                            <th>Title</th>
                            <th>Operations</th>
                        </tr>
                        </thead>
                        <tbody>
                        { this.state.library.ownedBooks.map((book, index) =>
                            <Book key={ index } book={ book }
                                  markReading={ this.readingMarking.bind(this) }
                                  showBorrow={showBorrow }
                                  showBorrower={ showBorrow && !book.borrowedBy }
                                  borrowToAnon={ true }
                                  reading={ this.context.readingBooks.includes(book.id) }
                                  borrow={this.borrow}/>) }
                        </tbody>
                    </table>
                </section>

                <section>
                    <h2 className="title v-spaced">Borrowed books by library owner</h2>
                    <table className="display-table">
                        <thead>
                        <tr>
                            <th>Author</th>
                            <th>Title</th>
                            <th>Operations</th>
                        </tr>
                        </thead>
                        <tbody>
                        { this.state.library.borrowedBooks.map((book, index) =>
                            <Book key={ index } book={ book.book }
                                  markReading={ this.readingMarking.bind(this) }
                                  showBorrow={ !showBorrow }
                                  showBorrower={ false }
                                  reading={ this.context.readingBooks.includes(book.book.id) }/>) }
                        </tbody>
                    </table>
                </section>
            </div>
        );
    }

}