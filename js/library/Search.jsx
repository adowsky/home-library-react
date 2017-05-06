import React from "react";
import PropTypes from "prop-types";

export default class extends React.Component {
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
                    <table>
                        <tbody>
                        <input name="author" placeholder="author" value={ this.state.form.author }
                               onChange={ this.handle }/>
                        <input name="title" placeholder="title" value={ this.state.form.title }
                               onChange={ this.handle }/>
                        <input name="find" type="submit" value="find"/>
                        </tbody>
                    </table>
                </form>
                { this.state.books.map(book => <div className="result"
                                                    onClick={() => this.props.onSelect(book)}>{ `${book.author} - "${book.title}"`}</div>) }
            </section>
        );
    }
}