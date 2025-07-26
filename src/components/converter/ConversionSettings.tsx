import React from 'react'
import type { ConversionSettings, ImageFormat } from '../../types'
import { getSupportedFormats } from '../../utils/imageConverter'
import Select from '../ui/Select'
import Slider from '../ui/Slider'

interface ConversionSettingsProps {
  settings: ConversionSettings
  onChange: (settings: ConversionSettings) => void
}

const ConversionSettingsComponent: React.FC<ConversionSettingsProps> = ({
  settings,
  onChange
}) => {
  const formats = getSupportedFormats()

  const handleChange = (key: keyof ConversionSettings, value: any) => {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Settings</h3>
      
      <div className="space-y-6">
        {/* Output Format */}
        <div>
          <Select
            label="Output Format"
            options={formats.map(format => ({
              value: format.value,
              label: `${format.label} (${format.extension})`
            }))}
            value={settings.format}
            onChange={(value) => handleChange('format', value as ImageFormat)}
            fullWidth
          />
        </div>

        {/* Quality (for JPEG and WebP) */}
        {(settings.format === 'jpeg' || settings.format === 'webp') && (
          <div>
            <Slider
              label={`Quality: ${settings.quality}%`}
              min={10}
              max={100}
              step={5}
              value={settings.quality}
              onChange={(value) => handleChange('quality', value)}
              showValue={false}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Lower size</span>
              <span>Higher quality</span>
            </div>
          </div>
        )}

        {/* Resize feature has been removed */}
      </div>
    </div>
  )
}

export default ConversionSettingsComponent