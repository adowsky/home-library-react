import React from "react";
import PropTypes from "prop-types";

export default class Serach extends React.Component {
    static contextTypes = {
        restClient: PropTypes.object
    };

    constructor(...props) {
        super(...props);
        this.state = {
            form: {
                author: "",
                title: ""
            },
            books: []
        };

        this.handle = this.handle.bind(this);
        this.find = this.find.bind(this);
    }

    handle(event) {
        const { name, value } = event.target;

        const form = Object.assign({}, this.state.form, { [name]: value });
        this.setState({ form });
    }

    find(event) {
        event.preventDefault();
        const { author, title } = this.state.form;

        this.context.restClient.postRequest(`/api/libraries`, { author, title })
            .then(books => this.setState({ books }))
            .then(this.props.onFind);
    }

    render() {
        return (
            <section>
                <form onSubmit={this.find}>

                        <input name="author" placeholder="author" value={ this.state.form.author }
                               onChange={ this.handle }/>
                        <input name="title" placeholder="title" value={ this.state.form.title }
                               onChange={ this.handle }/>
                        <input name="find" type="submit" value="find"/>

                </form>
                { this.state.books.map((book, idx) => <div className="result" key={ idx }
                                                    onClick={() => this.props.onSelect(book)}>{ `${book.author} - "${book.title}" source:${book.source}`}</div>) }
            </section>
        );
    }
}