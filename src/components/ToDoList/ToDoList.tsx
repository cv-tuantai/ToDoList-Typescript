import { useEffect, useState } from 'react'
import TaskInput from '../TaskInput'
import TaskList from '../TaskList'
import styles from './toDoList.module.scss'
import { Todo } from '../../@types/todo.type'

// interface IHandleNewTodo {
//   (todo: Todo[]): Todo[]
// }

type IHandleNewTodo = (todo: Todo[]) => Todo[]

const syncReactToLocal = (handleNewTodo: IHandleNewTodo) => {
  const todoString = localStorage.getItem('todo')
  const todoObject: Todo[] = JSON.parse(todoString || '[]')
  const newTodoObj = handleNewTodo(todoObject)
  localStorage.setItem('todo', JSON.stringify(newTodoObj))
}

export default function ToDoList() {
  const [todo, setTodo] = useState<Todo[]>([])
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null)
  const finish = todo.filter((item) => item.done)
  const notFinish = todo.filter((item) => !item.done)

  useEffect(() => {
    const todoString = localStorage.getItem('todo')
    const todoObject: Todo[] = JSON.parse(todoString || '[]')
    setTodo(todoObject)
  }, [])

  const addTodo = (name: string) => {
    const newTodo: Todo = {
      done: false,
      id: new Date().toISOString(),
      name
    }
    const handler = (prev: Todo[]) => [...prev, newTodo]
    setTodo(handler)
    syncReactToLocal(handler)
  }

  const handleDoneTodo = (id: string, done: boolean) => {
    const handler = (prev: Todo[]) => {
      return prev.map((todo) => {
        if (todo.id === id) {
          return { ...todo, done }
        }
        return todo
      })
    }
    setTodo(handler)
    syncReactToLocal(handler)
  }

  const editTodo = (name: string) => {
    setCurrentTodo((prev) => {
      if (prev) return { ...prev, name }
      return null
    })
  }

  const startEditTodo = (id: string) => {
    const findedTodo = todo.find((item) => item.id === id)
    if (findedTodo) {
      setCurrentTodo(findedTodo)
    }
  }

  const finishEditTodo = () => {
    const handler = (prev: Todo[]) => {
      return prev.map((todo) => {
        if (todo.id === currentTodo?.id) {
          return currentTodo
        }
        return todo
      })
    }
    setTodo(handler)
    setCurrentTodo(null)
    syncReactToLocal(handler)
  }

  const deleteTodo = (id: string) => {
    if (currentTodo) {
      setCurrentTodo(null)
    }
    const handler = (prev: Todo[]) => {
      const findedIndex = prev.findIndex((todo) => todo.id === id)
      if (findedIndex !== -1) {
        const result = [...prev]
        result.splice(findedIndex, 1)
        return result
      }
      return prev
    }
    setTodo(handler)
    syncReactToLocal(handler)
  }

  return (
    <div className={styles.toDoList}>
      <div className={styles.toDoListContainer}>
        <TaskInput addTodo={addTodo} currentTodo={currentTodo} editTodo={editTodo} finishEditTodo={finishEditTodo} />
        <TaskList
          todoList={notFinish}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
        <TaskList
          doneTaskList
          todoList={finish}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
      </div>
    </div>
  )
}
