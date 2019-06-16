import React from 'react';
import { Card } from '@alifd/next';
import ComSelector from '../ComSelector/ComSelector';
import ControlPad from '../ControlPad/ControlPad';
const { ipcRenderer } = window.electron;

class Machine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: '',
        };
        ipcRenderer.on('machine/status', (event, status) => {
            console.log(status);
            this.setState({
                status,
            });
        });
    }

    componentDidMount() {
        ipcRenderer.send('machine/status.update');
    }

    render() {
        const { status } = this.state;
        const MACHINE_STATUS = {
            offline: '离线',
            ready: '就绪',
            busy: '繁忙',
            unknown: '未知',
        };
        return (
            <Card
                title="机器状态"
                contentHeight="auto"
            >
                <ComSelector/>
                <h3>{ MACHINE_STATUS[status] }</h3>
                <ControlPad/>
            </Card>
        );
    }
}

export default Machine;