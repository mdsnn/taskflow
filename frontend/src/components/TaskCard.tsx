import { Task } from '../types'
import styles from './TaskCard.module.css'

interface Props {
  task: Task
  onToggle: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export default function TaskCard({ task, onToggle, onEdit, onDelete }: Props) {
  return (
    <div className={`${styles.card} ${task.completed ? styles.completed : ''}`}>
      <button
        className={`${styles.check} ${task.completed ? styles.checked : ''}`}
        onClick={() => onToggle(task)}
        aria-label="Toggle complete"
      />
      <div className={styles.body}>
        <p className={styles.title}>{task.title}</p>
        {task.description && <p className={styles.desc}>{task.description}</p>}
        <div className={styles.meta}>
          <span className={`${styles.priority} ${styles[task.priority]}`}>{task.priority}</span>
          <span className={styles.date}>{fmt(task.created_at)}</span>
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.iconBtn} onClick={() => onEdit(task)} title="Edit">✎</button>
        <button className={`${styles.iconBtn} ${styles.del}`} onClick={() => onDelete(task.id)} title="Delete">✕</button>
      </div>
    </div>
  )
}