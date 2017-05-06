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
            lastBook: null
        }

    }

    componentDidMount() {
        this.context.restClient.getRequest(`/api/users/statistics`)
            .then((stats) => this.setState(stats))
    }


    render() {
        return (
            <section>
                <div>
                    <h2>You are currently reading following books:</h2>
                    { this.context.readingBooks.map(book => `${book.author}: "${book.title}", `) }
                </div>
                <div>
                    <h2>Last finished book:
                        { (this.state.lastBook) ? `${this.state.lastBook.author}: "${this.state.lastBook.title}"` :
                            "You haven't finished any book yet" }
                    </h2>

                </div>
                <div>
                    <h2>Your speed of reading: { `${this.state.average} per month` }</h2>
                </div>
            </section>
        );
    }
}