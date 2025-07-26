import React from 'react'
import clsx from 'clsx'

interface SliderProps {
  min: number
  max: number
  step?: number
  value: number
  onChange: (value: number) => void
  label?: string
  showValue?: boolean
  className?: string
  disabled?: boolean
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  showValue = false,
  className,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value))
  }

  return (
    <div className={clsx('flex flex-col', className)}>
      <div className="flex justify-between items-center mb-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        {showValue && (
          <span className="text-sm font-medium text-gray-700">
            {value}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={clsx(
          'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

export default Slider