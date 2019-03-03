// Core
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

// Component
import Scheduler from 'components/Scheduler';

@hot(module)
export default class App extends Component {
    render () {
        return (
            <Scheduler />
        );
    }
}
