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
            addingBook: null
        };

        this.onRequestAdd = this.onRequestAdd.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.handle = this.handle.bind(this);
        this.rejectAdd = this.rejectAdd.bind(this);
        this.borrow = this.borrow.bind(this);
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
        this.setState({ addingBook });
    }

    rejectAdd(event) {
        event.preventDefault();
        this.setState({ addingBook: null })
    }

    borrow(bookId, mode, outside=false) {
        this.context.restClient.postRequestNoBody(`/api/books/${bookId}/borrows`, {
            type: mode,
            outside: outside
        })
            .then(() => {
                const book = this.state.books.filter(book => book.id === bookId);
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
            })
    }

    render() {
        const showBorrow = this.context.username !== this.props.match.params.username;
        return (
            <div>
                <BookHeaderView add={ this.onRequestAdd }/>
                { (this.state.addingBook) ?
                    <Book book={ this.state.addingBook } add={ this.onAdd } handle={ this.handle }
                          reject={ this.rejectAdd }/>
                    : null }

                { this.state.library.ownedBooks.map((book, index) =>
                    <Book key={ index } book={ book }
                          markReading={ this.readingMarking.bind(this) }
                          showBorrow={showBorrow }
                          showBorrower={ showBorrow && !book.borrowedBy }
                          borrowToAnon={ true }
                          reading={ this.context.readingBooks.includes(book.id) }
                          borrow={this.borrow}/>) }

                <h2>Borrowed books</h2>

                { this.state.library.borrowedBooks.map((book, index) =>
                    <Book key={ index } book={ book.book }
                          markReading={ this.readingMarking.bind(this) }
                          showBorrow={ !showBorrow }
                          showBorrower={ false }
                          reading={ this.context.readingBooks.includes(book.book.id) }/>) }
            </div>
        );
    }

}