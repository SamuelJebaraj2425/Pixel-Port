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
    <div className="w-[280px] sm:max-w-sm text-left relative mx-auto">
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
      {/* Generate Button and Popup Container */}
      <div className="relative mt-6">
        <div className="flex justify-end items-center gap-3">
          {/* Success Popup - Mobile */}
          {showPopup && (
            <div className="hidden max-[420px]:block">
              <div className="bg-green-100 border border-green-300 text-green-800 px-2 py-1 rounded text-xs animate-fade-in">
                ✓ Download completed!
              </div>
            </div>
          )}
          <Button
            onClick={onGenerate}
            disabled={!imageCount}
            variant="primary"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Convert
          </Button>
        </div>
        {/* Success Popup - Desktop */}
        {showPopup && (
          <div className="max-[420px]:hidden absolute left-0 right-0" style={{ bottom: '-2.5rem' }}>
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