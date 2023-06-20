
import './index.scss'

interface IProps {
  title: string
  disable?: boolean
  className?: string
  icon?: React.ReactNode
  onClick: () => void
}
export function Button({ icon, title, className = '', onClick, disable = false }: IProps) {
  return (
    <button className={`snapDemoBtn ${className} ${disable ? 'disable' : ''}`} onClick={onClick}>
      {icon && icon}
      <span>{title}</span>
    </button>
  )
}