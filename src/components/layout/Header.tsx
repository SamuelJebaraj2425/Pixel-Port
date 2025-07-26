import React from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import Button from '../ui/Button'

// Removed stray interface property declarations
interface HeaderProps {
  onToggleSettings: () => void;
  onDownloadAll: () => void;
  showDownloadAll: boolean;
  conversionCount: number;
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
            <div className="flex-shrink-0 flex items-center">
              {/* Minimal Photo SVG Icon */}
              <svg className="w-8 h-8 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="5" width="18" height="14" rx="3" fill="#e0e7ff" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="8.5" cy="11" r="1.5" fill="#3b82f6"/>
                <path d="M3 17l4.5-4.5a2 2 0 0 1 3 0L14 17l3-3a2 2 0 0 1 3 0L21 17" stroke="#3b82f6" strokeWidth="1.5" fill="none"/>
              </svg>
              <h1 className="text-3xl font-bold text-blue-500 dark:black">Pixel Port</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
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