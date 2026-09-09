import { useEffect, useRef, useState } from 'react'
import './Task.scss'

function Task({ text,
	completed,
	onDelete,
	onToggle,
	onEdit,
	onDragStart,
	onDragOver,
	onDrop,
	isDropTarget
}) {
	const [isEditing, setIsEditing] = useState(false)
	const [editText, setEditText] = useState(text)
	const inputRef = useRef(null)
	const [error, setError] = useState('')

	useEffect(() => {
		if (isEditing) {
			inputRef.current.focus()
			inputRef.current.select()
		}
	}, [isEditing])

	function startEditing() {
		setEditText(text)
		setIsEditing(true)
	}

	function saveEditing() {
		const trimmedText = editText.trim()

		if (trimmedText === '') {
			setError('Название задачи не может быть пустым')
			return
		}

		setError('')
		onEdit(trimmedText)
		setIsEditing(false)
	}

	function cancelEditing() {
		setEditText(text)
		setIsEditing(false)
	}

	return (
		<li className={`task ${completed ? 'task--completed' : ''} ${isDropTarget ? 'task--drop-target' : ''}`}
			draggable
			onDragStart={onDragStart}
			onDragOver={(event) => {
				event.preventDefault()
				onDragOver()
			}}
			onDrop={onDrop}
		>
			{isEditing ? (
				<>
					<input
						type="text"
						ref={inputRef}
						value={editText}
						onChange={(event) => {
							setEditText(event.target.value)
							setError('')
						}}
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								saveEditing()
							}

							if (event.key === 'Escape') {
								cancelEditing()
							}
						}}
					/>

					{error && (
						<div className="task__error">
							{error}
						</div>
					)}

					<button
						type="button"
						className="task__button"
						onClick={saveEditing}
					>
						Сохранить
					</button>

					<button
						type="button"
						className="task__button"
						onClick={cancelEditing}
					>
						Отмена
					</button>
				</>

			) : (
				<span className="task__text">
					{text}
				</span>
			)}

			{!isEditing && (
				<button
					type="button"
					className="task__button"
					onClick={startEditing}
				>
					Изменить
				</button>
			)}

			{!isEditing && (
				<button
					type='button'
					className='task__button task__complete'
					onClick={onToggle}
				>
					{completed ? 'Отменить' : 'Выполнить'}
				</button>
			)}

			{!isEditing && (
				<button
					type="button"
					className="task__button task__delete"
					onClick={onDelete}
				>
					Delete
				</button>
			)}
		</li>)
}

export default Task