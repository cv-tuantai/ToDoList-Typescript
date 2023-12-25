import { Todo } from '../../@types/todo.type'
import styles from './taskList.module.scss'

interface IDoneTaskListProps {
  doneTaskList?: boolean
  todoList: Todo[]
  handleDoneTodo: (id: string, done: boolean) => void
  startEditTodo: (id: string) => void
  deleteTodo: (id: string) => void
}

export default function TaskList({
  doneTaskList,
  todoList,
  handleDoneTodo,
  startEditTodo,
  deleteTodo
}: IDoneTaskListProps) {
  return (
    <div>
      <h2 className={styles.title}>{doneTaskList ? 'Hoàn thành' : 'Chưa hoàn thành'}</h2>
      <div className={styles.tasks}>
        {todoList.map((todo) => {
          return (
            <div className={styles.task} key={todo.id}>
              <input
                type='checkbox'
                className={styles.taskCheckbox}
                checked={todo.done}
                onChange={(event) => handleDoneTodo(todo.id, event.target.checked)}
              />
              <span className={`${styles.taskName} ${todo.done ? styles.taskNameDone : ''}`}>{todo.name}</span>
              <div className={styles.taskAction}>
                <button className={styles.taskBtn} onClick={() => startEditTodo(todo.id)}>
                  🖋️
                </button>
                <button className={styles.taskBtn} onClick={() => deleteTodo(todo.id)}>
                  🗑️
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
