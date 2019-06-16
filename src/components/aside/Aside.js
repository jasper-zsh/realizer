import React from 'react';
import Layout from '@icedesign/layout';
import { Card } from '@alifd/next';
import Machine from '../machine/Machine';
import Console from '../Console/Console';

class Aside extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            machine: {}
        };

    }

    render() {
        return (
            <div>
                <Machine/>
                <Console/>
            </div>
        );
    }
}

export default Aside;