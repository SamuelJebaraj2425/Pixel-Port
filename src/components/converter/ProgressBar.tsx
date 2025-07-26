import React from 'react'
import clsx from 'clsx'

interface ProgressBarProps {
  progress: number
  className?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '' }) => {
  return (
    <div className={clsx('w-full bg-gray-200 rounded-full h-2', className)}>
      <div 
        className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  )
}

export default ProgressBar