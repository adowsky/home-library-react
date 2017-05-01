import React from "react";
import PropTypes from "prop-types";

import BookHeaderView from "./BookHeaderView";
import Book from "./Book";

export default class UserLibrary extends React.Component {
    static contextTypes = {
        restClient: PropTypes.object
    };

    constructor(...props) {
        super(...props);
        this.state = {
            books: [],
            addingBook: null
        };

        this.onRequestAdd = this.onRequestAdd.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.handle = this.handle.bind(this);
        this.rejectAdd = this.rejectAdd.bind(this);
    }

    componentDidMount() {
        const { username } = this.props.match.params;
        this.context.restClient.getRequest(`/api/libraries/${username}`)
            .then(books => this.setState({ books }));
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
        this.setState({  addingBook: null })
    }

    render() {
        return (
            <div>
                <BookHeaderView add={ this.onRequestAdd }/>
                { (this.state.addingBook) ?
                    <Book book={ this.state.addingBook } add={ this.onAdd } handle={ this.handle } reject={ this.rejectAdd }/>
                    : null }
                { this.state.books.map((book, index) => <Book key={ index } book={ book } />) }
            </div>
        );
    }

}