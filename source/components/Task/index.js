// Core
import React, { PureComponent } from 'react';
import cx from 'classnames';
import { func, string, bool } from 'prop-types';

// Instruments
import Styles from './styles.m.css';
import Checkbox from 'theme/assets/Checkbox';
import Star from 'theme/assets/Star';
import Edit from 'theme/assets/Edit';
import Remove from 'theme/assets/Remove';

export default class Task extends PureComponent {
    state = {
        isTaskEditing: false,
        newMessage: this.props.message,
    }

    taskInput = React.createRef();

    static propTypes = {
        id: string.isRequired,
        completed: bool.isRequired,
        favorite: bool.isRequired,
        message: string.isRequired,
        created: string.isRequired,
        modified: string,
        _removeTaskAsync: func.isRequired,
        _updateTaskAsync: func.isRequired,
    }

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _setTaskEditingState = (state) => {
        this.setState({
            isTaskEditing: state
        }, () => {
            if (this.state.isTaskEditing) {
                this.taskInput.current.focus();
            }
        });

        
    }

    _updateNewTaskMessage = (event) => {
        this.setState({
            newMessage: event.target.value
        });
    }

    _updateTask = () => {
        this._setTaskEditingState(false);

        const { _updateTaskAsync, message } = this.props;
        const { newMessage } = this.state;

        if (newMessage == message) {
            return null;
        }

        const taskShape = this._getTaskShape({message: newMessage});
        _updateTaskAsync(taskShape);
    }

    _updateTaskMessageOnClick = () => {
        const { newMessage, isTaskEditing } = this.state;

        if (isTaskEditing) {
            this._updateTask();

            return null;
        }

        this._setTaskEditingState(true);
    }

    _cancelUpdatingTaskMessage = () => {
        this.setState({
            newMessage: this.props.message
        });

        this._setTaskEditingState(false);
    }

    _updateTaskMessageOnKeyDown = (event) => {
        const enterKey = event.key === 'Enter';
        const escapeKey = event.key === 'Escape';

        if (escapeKey) {
            this._cancelUpdatingTaskMessage();
        } else if (enterKey) {

            if (!this.state.newMessage) {
                return null;
            }

            this._updateTask();
            this._setTaskEditingState(false);
        }
    }

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync, completed } = this.props;

        const taskShape = this._getTaskShape({completed: !completed});
        _updateTaskAsync(taskShape);
    }

    _toggleTaskFavoriteState = (event) => {
        const { _updateTaskAsync, favorite } = this.props;

        const taskShape = this._getTaskShape({favorite: !favorite});
        _updateTaskAsync(taskShape);
    }

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;
        _removeTaskAsync(id);
    }

    render () {
        const {
            id,
            completed,
            favorite
        } = this.props;

        const { newMessage, isTaskEditing } = this.state;


        const taskStyle = cx(Styles.task, completed ? Styles.completed : null);

        return (
            <li className = { taskStyle }>
                <div className = { Styles.content }>
                    <Checkbox 
                        inlineBlock
                        className = { Styles.toggleTaskCompletedState }
                        checked = { completed }
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                        onClick = { this._toggleTaskCompletedState }
                    />
                    <input 
                        ref = { this.taskInput } 
                        disabled = { !isTaskEditing }
                        maxLength = { 50 }
                        type = "text" 
                        value = { newMessage }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateTaskMessageOnKeyDown }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star 
                        inlineBlock
                        className = { Styles.toggleTaskFavoriteState }
                        checked = { favorite }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit 
                        inlineBlock
                        className = { Styles.updateTaskMessageOnClick }
                        checked = { false }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._updateTaskMessageOnClick }
                    />
                    <Remove 
                        inlineBlock
                        className = { Styles.removeTask }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
