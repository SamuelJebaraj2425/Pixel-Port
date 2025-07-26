import React from 'react'
import type { ConversionSettings, ImageFormat } from '../../types'
import { getSupportedFormats } from '../../utils/imageConverter'

import Button from '../ui/Button';
import Select from '../ui/Select'



interface ConversionSettingsProps {
  settings: ConversionSettings;
  onChange: (settings: ConversionSettings) => void;
  imageCount?: number;
  onGenerate?: () => void;
  isProcessing?: boolean;
  hasFiles?: boolean;
  showPopup?: boolean;
}

const ConversionSettingsComponent: React.FC<ConversionSettingsProps> = ({
  settings,
  onChange,
  imageCount,
  onGenerate,
  // isProcessing and hasFiles removed
  showPopup
}) => {
  const formats = getSupportedFormats()


  const handleChange = (key: keyof ConversionSettings, value: any) => {
    onChange({ ...settings, [key]: value })
  }


  return (
    <div className="max-w-sm text-left relative">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Image converter</h3>
      {typeof imageCount === 'number' && (
        <span className="block mb-4 text-lg text-gray-600">Images selected: <span className="font-semibold text-gray-800">{imageCount}</span></span>
      )}
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

        {/* Quality slider removed as per user request */}

        {/* Resize feature has been removed */}
      </div>
      {/* Generate Button restored as per user request */}
      <div className="flex justify-end mt-6 space-x-3">
        <Button
          onClick={onGenerate}
          disabled={!imageCount}
          variant="primary"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Convert
        </Button>
      </div>
      {/* Popup for zip generated */}
      <div className="relative" style={{ minHeight: '2.5rem' }}>
        {showPopup && (
          <div className="absolute left-0 right-0" style={{ bottom: '-2.5rem' }}>
            <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded shadow-lg animate-fade-in text-center z-20">
              Zip file generated and download started!
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConversionSettingsComponent