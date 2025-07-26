import React from 'react'
import { Cog6ToothIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import Button from '../ui/Button'

interface HeaderProps {
  onToggleSettings: () => void
  onDownloadAll: () => void
  showDownloadAll: boolean
  conversionCount: number
}

const Header: React.FC<HeaderProps> = ({
  onToggleSettings,
  onDownloadAll,
  showDownloadAll,
  conversionCount
}) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">Image Converter</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleSettings}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Toggle Settings"
            >
              <Cog6ToothIcon className="w-6 h-6" />
            </button>
            
            {showDownloadAll && (
              <Button
                onClick={onDownloadAll}
                variant="primary"
                size="sm"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Download All ({conversionCount})
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header