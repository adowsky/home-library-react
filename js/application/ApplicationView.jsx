import React from 'react';
import HeaderView from "./HeaderView";

export default class ApplicationView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="app">
                <HeaderView />

                { this.props.children }
            </div>
        );
    }
}
