import React from "react";
import PropTypes from "prop-types";

import BookHeaderView from "./BookHeaderView";

export default class UserLibrary extends React.Component {
    static contextTypes = {
        restClient: PropTypes.object
    };

    constructor(...props) {
        super(...props);
         this.state = {
             books: []
         };
    }

    componentDidMount() {
        const { username } = this.props.match.params;
        this.context.restClient.getRequest(`api/libraries/${username}`)
            .then(books => this.setState({ books }));
    }

    render() {
        return (
          <div>
              <BookHeaderView/>
              { this.state.books.map(book =>
              <div>
                  <p>{book.id}</p>
                  <p>{book.title}</p>
                  <p>{book.author}</p>
                  <p>{book.borrowed}</p>
              </div>) }
          </div>
        );
    }

}