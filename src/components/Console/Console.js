import React from 'react';
import { Input, Field, Button } from '@alifd/next';
const { ipcRenderer } = window.electron;

class Console extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
        };
        ipcRenderer.on('connector/data', (event, data) => {
            this.setState({
                data: `${this.state.data}\n> ${data}`
            });
        });
        this.field = new Field(this);
    }

    onSend = () => {
        const command = this.field.getValue('command');
        this.setState({
            data: `${this.state.data}\n< ${command}`
        });
        ipcRenderer.send('connector/send', command);
        ipcRenderer.once('connector/send.response', (event, response) => {
            console.log(response);
        });
        this.field.setValue('command', '');
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const elem = this.refs.console.getInputNode();
        elem.scrollTop = elem.scrollHeight;
    }

    render() {
        const init = this.field.init;
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Input.TextArea
                    style={{ width: '100%' }}
                    value={this.state.data}
                    readOnly={true}
                    ref="console"
                    rows={20}
                />
                <div>
                    <Input
                        {...init('command')}
                        onPressEnter={ this.onSend }
                    />
                    <Button onClick={ this.onSend } >发送</Button>
                </div>
            </div>
        );
    }
}

export default Console;