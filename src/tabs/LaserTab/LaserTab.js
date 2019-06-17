import React from 'react';
import { Input, Button } from '@alifd/next';
const { ipcRenderer } = window.electron;

class LaserTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            img: null,
        };
        ipcRenderer.on('laser/image', (event, imgSrc) => {
            console.log(imgSrc);
            this.setState({
                img: imgSrc
            });
        });
    }

    render() {
        return (
            <div style={{ margin: 10 }}>
                <Input
                    htmlType="file"
                    onChange={this.onFileSelected}
                    ref="file"
                    accept="image/*"
                />
                <Button onClick={this.onPrint}>开始</Button>
                <img src={this.state.img} />
            </div>
        )
    }

    onFileSelected = () => {
        const file = this.refs.file.getInputNode().files[0];
        console.log(file);
        ipcRenderer.send('laser/image.update', file.path, 50, 50, 0.05);
    };

    onPrint = () => {
        ipcRenderer.send('laser/print', 100, 0.01);
    };
}

export default LaserTab;