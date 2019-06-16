import React from 'react';
import { Select, Button } from '@alifd/next';
import Notification from '@icedesign/notification';
const { ipcRenderer } = window.electron;

class ComSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ports: []
        };
        ipcRenderer.on('com/list', (event, err, ports) => {
            if (err) {
                Notification.error({
                    message: '错误',
                    description: '获取串口列表失败',
                });
            } else {
                this.setState({
                    ports,
                });
            }
        });
        ipcRenderer.on('connector/connect.error', (event, err) => {
            console.log(err);
            Notification.error({
                message: '错误',
                description: '打开端口失败',
            });
        })
    }

    componentDidMount() {
        this.onRefresh();
    }

    onRefresh = () => {
        ipcRenderer.send('com/list.update');
    };

    onSelect = (port) => {
        ipcRenderer.send('connector/select_port', port);
    };

    render() {
        const ports = this.state.ports.map(port => {
            return {
                label: port.comName,
                value: port.comName,
            };
        });
        return (
            <div>
                <Select
                    dataSource={ ports }
                    onChange={ this.onSelect }
                />
                <Button
                    onClick={this.onRefresh}
                />
            </div>
        );
    }
}

export default ComSelector;