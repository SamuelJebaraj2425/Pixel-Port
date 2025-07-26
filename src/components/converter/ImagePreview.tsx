import React from 'react'
import { XMarkIcon, EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import type { ImageFile, ConversionResult } from '../../types'
import { formatFileSize } from '../../utils/imageConverter'

interface ImagePreviewProps {
  imageFile: ImageFile
  conversionResult?: ConversionResult
  onRemove: (id: string) => void
  onDownload: (result: ConversionResult) => void
  onPreview: (imageFile: ImageFile) => void
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageFile,
  conversionResult,
  onRemove,
  onDownload,
  onPreview
}) => {
  const isConverted = !!conversionResult

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* Image thumbnail */}
      <div className="relative aspect-video bg-gray-100">
        <img
          src={isConverted ? conversionResult.convertedUrl : imageFile.url}
          alt={imageFile.name}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay buttons */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={() => onPreview(imageFile)}
              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
              title="Preview"
            >
              <EyeIcon className="w-5 h-5 text-gray-700" />
            </button>
            
            {isConverted && (
              <button
                onClick={() => onDownload(conversionResult)}
                className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                title="Download"
              >
                <ArrowDownTrayIcon className="w-5 h-5 text-gray-700" />
              </button>
            )}
          </div>
        </div>

        {/* Remove button */}
        <button
          onClick={() => onRemove(imageFile.id)}
          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
          title="Remove"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>

        {/* Status indicator */}
        {isConverted && (
          <div className="absolute bottom-2 left-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Converted
            </span>
          </div>
        )}
      </div>

      {/* File info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate" title={imageFile.name}>
          {imageFile.name}
        </h3>
        
        <div className="mt-2 text-sm text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Format:</span>
            <span className="font-medium">
              {imageFile.originalFormat.toUpperCase()} → {imageFile.targetFormat.toUpperCase()}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Original Size:</span>
            <span>{formatFileSize(imageFile.size)}</span>
          </div>
          
          {isConverted && (
            <>
              <div className="flex justify-between">
                <span>New Size:</span>
                <span className={`font-medium ${
                  conversionResult.convertedSize < imageFile.size 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {formatFileSize(conversionResult.convertedSize)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Compression:</span>
                <span className={`font-medium ${
                  conversionResult.compressionRatio > 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {conversionResult.compressionRatio > 0 ? '-' : '+'}
                  {Math.abs(conversionResult.compressionRatio).toFixed(1)}%
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImagePreview