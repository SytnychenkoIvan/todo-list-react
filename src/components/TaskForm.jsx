import { useState } from 'react'

function TaskForm({ onAdd }) {
	const [value, setValue] = useState('')

	function handleSubmit(event) {
		event.preventDefault()

		const trimmedValue = value.trim()

		if (trimmedValue === '') {
			return
		}

		onAdd(trimmedValue)
		setValue('')
	}

	return (
		<form className="form" onSubmit={handleSubmit}>
			<input
				type="text"
				placeholder="Новая задача"
				value={value}
				onChange={(event) => setValue(event.target.value)}
			/>

			<button type='submit'>
				Добавить
			</button>
		</form>
	)
}

export default TaskForm