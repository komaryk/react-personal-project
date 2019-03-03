// Core
import React, { Component } from 'react';
import moment from 'moment';
import FlipMove from 'react-flip-move';

// Component
import Spinner from 'components/Spinner';
import Task from 'components/Task';
import Checkbox from 'theme/assets/Checkbox';

// Instruments
import Styles from './styles.m.css';
import { sortTasksByDate, sortTasksByGroup } from 'Instruments';
import { api, TOKEN } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

export default class Scheduler extends Component {
	state = {
        tasks: [],
        newTaskMessage: '',
        tasksFilter: '',
        isTasksFetching: false
    }

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _setTasksFetchingState = (state) => {
        this.setState({
            isTasksFetching: state
        });
    }

    _fetchTasksAsync = async () => {
        this._setTasksFetchingState(true);

        const tasks = await api.fetchTasks();

        this.setState({
            tasks,
        });
        
        this._setTasksFetchingState(false);
    }

    _createTaskAsync = async (event) => {
    	event.preventDefault();

        const { newTaskMessage } = this.state;

        if (!newTaskMessage) {
            return null;
        }
		
        this._setTasksFetchingState(true);

        const updatedTask = await api.createTask(newTaskMessage);
        
        this.setState(({ tasks }) => ({
            tasks: [updatedTask, ...tasks],
        	newTaskMessage: '',
        }));
        
        this._setTasksFetchingState(false);
    }

    _updateTaskAsync = async (task) => {
        this._setTasksFetchingState(true);

        const [ updatedTask ] = await api.updateTask(task);

        this.setState(({ tasks }) => ({
            tasks: tasks.map((task) => task.id == updatedTask.id ? updatedTask : task),
        }));
        
        this._setTasksFetchingState(false);
    }

    _removeTaskAsync = async (id) => {
        this._setTasksFetchingState(true);

        await api.removeTask(id);

        this.setState(({ tasks }) => ({
            tasks: tasks.filter((task) => task.id != id),
        }));
        	
        this._setTasksFetchingState(false);

    }

    _completeAllTasksAsync = async () => {
    	if (this._getAllCompleted()) {
    		return null;
    	}

    	this._setTasksFetchingState(true);
    	
    	const { tasks } = this.state;
    	const notCompletedTasks = tasks.filter(task => task.completed == false);

		await api.completeAllTasks(notCompletedTasks);

        this.setState(({ tasks }) => ({
            tasks: tasks.map((task) => {
        		return {
        			...task,
        			completed: true
        		}
        	})
        }));

    	this._setTasksFetchingState(false);

    }

    _updateNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value
        });
    }

    _updateTasksFilter = (event) => {
        this.setState({
            tasksFilter: event.target.value.toLowerCase()
        });
    }

    _filterTasks = () => {
    	const { tasksFilter, tasks } = this.state;

    	if (!tasksFilter) {
    		return tasks;
    	}

    	const regexp = new RegExp(tasksFilter, 'gi');
    	const filteredTasks = tasks.filter((task) => task.message.match(regexp));

    	return filteredTasks;
    }

    _getAllCompleted = () => {
        const { tasks } = this.state;

        return tasks.every((task) => task.completed == true);
    }


    render () {
        const { 
        	tasks, 
        	newTaskMessage, 
        	tasksFilter, 
        	isTasksFetching 
        } = this.state;

        const filteredTasks = this._filterTasks();
        const sortedTasks = sortTasksByGroup(filteredTasks);

        const tasksJSX = sortedTasks.map((task) => {
            return (
                <Task key = { task.id } 
                    { ...task }
                    _updateTaskAsync = { this._updateTaskAsync }
                    _removeTaskAsync = { this._removeTaskAsync }
                />
            );
        });

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isTasksFetching } />
            	<main>
            		<header>
            			<h1>Планировщик задач</h1>
            			<input 
            				placeholder = "Поиск" 
            				type = "search" 
		                    onChange = { this._updateTasksFilter }
            				value = { tasksFilter }

            			/>
            		</header>
		            <section>
		            	<form onSubmit = { this._createTaskAsync } >
		                    <input 
		                    	type = "text"
		                    	placeholder = "Описание моей новой задачи"
		                    	maxLength = { 50 }
		                    	onChange = { this._updateNewTaskMessage }
		                    	value = { newTaskMessage }
		                    />
		                    <button>Добавить задачу</button>
		                </form>
            			<FlipMove typeName="ul">
		                	{ tasksJSX }
	            		</FlipMove>
		            </section>
	                <footer>
	                	<Checkbox 
	                        inlineBlock
	                        className = { Styles.toggleTaskCompletedState }
	                        checked = { this._getAllCompleted() }
	                        color1 = '#363636'
	                        color2 = '#fff'
	                        onClick = { this._completeAllTasksAsync }
	                    />
	                    <span className = { Styles.completeAllTasks }>
	                    	Все задачи выполнены
	                    </span>
	                </footer>
            	</main>
            </section>
        );
    }
}
