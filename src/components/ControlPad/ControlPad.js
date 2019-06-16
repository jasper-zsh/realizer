import React from 'react';
import { Button, Radio, Field } from '@alifd/next';
const { ipcRenderer } = window.electron;

const controlButtonStyle = {
    height: 40,
    width: 40
};

class ControlPad extends React.Component {
    field = new Field(this, {
        values: {
            step: 0.1,
        }
    });

    render() {
        const init = this.field.init;
        const STEPS = [
            {
                label: '0.1',
                value: 0.1,
            },
            {
                label: '1',
                value: 1
            },
            {
                label: '10',
                value: 10
            }
        ];
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Button style={controlButtonStyle} onClick={this.move('top')}>上</Button>
                        <div style={{ flexDirection: 'row' }}>
                            <Button style={controlButtonStyle} onClick={this.move('left')}>左</Button>
                            <Button style={controlButtonStyle}/>
                            <Button style={controlButtonStyle} onClick={this.move('right')}>右</Button>
                        </div>
                        <Button style={controlButtonStyle} onClick={this.move('bottom')}>下</Button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 15 }}>
                        <Button style={controlButtonStyle} onClick={this.move('up')} >上</Button>
                        <Button style={controlButtonStyle} />
                        <Button style={controlButtonStyle} onClick={this.move('down')} >下</Button>
                    </div>
                </div>
                <Radio.Group
                    {...init('step')}
                    style={{ marginTop: 10 }}
                    dataSource={STEPS}
                />
            </div>
        );
    }

    move = (direction) => {
        return () => {
            let x = 0, y = 0, z = 0;
            const step = this.field.getValue('step');
            switch (direction) {
                case 'left':
                    x -= step;
                    break;
                case 'right':
                    x += step;
                    break;
                case 'top':
                    y += step;
                    break;
                case 'bottom':
                    y -= step;
                    break;
                case 'up':
                    z += step;
                    break;
                case 'down':
                    z -= step;
                    break;
            }
            ipcRenderer.send('machine/move', x, y, z, true);
        };
    }
}

export default ControlPad;