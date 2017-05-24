import React from 'react';
import HeaderView from "./HeaderView";

export default class MessageViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }

    }

    componentDidUpdate(prevProps, prevState) {
        const messageIds = Object.keys(this.props.messages);
        const newMessages = messageIds.filter(msg => !this.state.messages.includes(msg));
        newMessages.forEach(msgIdx => {
            setTimeout(() => {
                this.props.messageOutdated(msgIdx);
            }, 4000)
        });

        if(newMessages.length !== 0) {
            const messages = newMessages.concat(this.state.messages);
            this.setState({ messages });
        }
    }

    render() {
        const messageIds = Object.keys(this.props.messages).sort().reverse();
        const display = (messageIds.length === 0) ? "minimized" : "";
        return (
            <div className={`message-viewer ${display}`}>
                { messageIds.map((id, idx) => <span key={idx} className="message">{ this.props.messages[id] }</span>) }
            </div>
        );
    }
}
