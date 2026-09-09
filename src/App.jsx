import { useEffect, useState } from "react"
import Task from "./components/Task"
import "./App.scss"
import TaskForm from './components/TaskForm'

function App() {
  // const [tasks, setTasks] = useState([])
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks')

    if (savedTasks) {
      return JSON.parse(savedTasks)
    }

    return []
  })

  const [draggedTask, setDraggedTask] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    console.log('tasks изменился:', tasks)

    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  function addTask(text) {

    const newTask = {
      id: Date.now(),
      text,
      completed: false
    }
    setTasks([...tasks, newTask])
  }

  function deleteTask(id) {
    const newTasks = tasks.filter((task) => task.id !== id)

    setTasks(newTasks)
  }

  function deleteCompletedTasks() {
    const newTasks = tasks.filter((task) => !task.completed)

    setTasks(newTasks)
  }

  function toggleTask(id) {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          completed: !task.completed
        }
      }
      return task
    })
    setTasks(newTasks)
  }

  function editTask(id, newText) {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          text: newText
        }
      }

      return task
    })

    setTasks(newTasks)
  }

  function handleDragStart(id) {
    setDraggedTask(id)
  }

  function handleDrop(targetId) {
    if (draggedTask === null || draggedTask === targetId) {
      return
    }

    const draggedIndex = tasks.findIndex(
      (task) => task.id === draggedTask
    )

    const targetIndex = tasks.findIndex(
      (task) => task.id === targetId
    )

    const newTasks = [...tasks]

    const [removedTask] = newTasks.splice(draggedIndex, 1)

    const newTargetIndex =
      draggedIndex < targetIndex
        ? targetIndex - 1
        : targetIndex

    newTasks.splice(newTargetIndex, 0, removedTask)

    setTasks(newTasks)
    setDraggedTask(null)
    setDropTarget(null)
  }

  function handleDragOver(id) {
    setDropTarget(id)
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !task.completed) ||
      (filter === 'completed' && task.completed)

    const matchesSearch =
      task.text.toLowerCase().includes(search.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const activeCount = tasks.filter((task) => !task.completed).length
  const completedCount = tasks.filter((task) => task.completed).length

  return (
    <div className="app">
      <h1>Мои задачи</h1>

      <div className="task-stats">
        <span>Осталось: {activeCount}</span>
        <span>Выполнено: {completedCount}</span>
      </div>

      <input
        className="search"
        type="text"
        placeholder="Поиск задачи..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <TaskForm
        onAdd={addTask}
      />

      <div className="filters">
        <button
          type="button"
          className={filter === 'all' ? 'filter--active' : ''}
          onClick={() => setFilter('all')}
        >
          Все
        </button>

        <button
          type="button"
          className={filter === 'active' ? 'filter--active' : ''}
          onClick={() => setFilter('active')}
        >
          Активные
        </button>

        <button
          type="button"
          className={filter === 'completed' ? 'filter--active' : ''}
          onClick={() => setFilter('completed')}
        >
          Выполненные
        </button>
      </div>

      <button
        type="button"
        className="delete-completed"
        onClick={deleteCompletedTasks}
      >
        Удалить выполненные
      </button>

      <ul className="tasks">
        {filteredTasks.map((task) => (
          <Task
            key={task.id}
            text={task.text}
            completed={task.completed}
            onDelete={() => deleteTask(task.id)}
            onToggle={() => toggleTask(task.id)}

            onEdit={(newText) => editTask(task.id, newText)}
            onDragStart={() => handleDragStart(task.id)}
            onDragOver={() => handleDragOver(task.id)}
            onDrop={() => handleDrop(task.id)}
            isDropTarget={dropTarget === task.id}
          />
        ))}
      </ul>
    </div>
  )
}

export default App
