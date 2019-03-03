import { MAIN_URL, TOKEN } from './config';

export const api = {
	async fetchTasks () {
		const response = await fetch(MAIN_URL, {
            method: 'GET',
            headers: {
                Authorization: TOKEN,
            },
        });

        const { data } = await response.json();
        return data;
	},

	async createTask (message) {
		const response = await fetch(MAIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: TOKEN,
            },
            body: JSON.stringify({ message }),
        });

        const { data } = await response.json();
        return data;
	},

	async updateTask (task) {
    	const response = await fetch(MAIN_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: TOKEN,
            },
            body: JSON.stringify([ task ]),
        });

        const { data } = await response.json();
        return data;
	},

	async removeTask (id) {
    	await fetch(`${MAIN_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });
	},

	async completeAllTasks (tasks) {
		const tasksToComplete = tasks.map((task) => {
    		return {
    			...task,
    			completed: true
    		}
    	});

		await Promise.all(
			tasksToComplete.map(async(task) => {
				await this.updateTask(task);
			})
		);
	}
}
