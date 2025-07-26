import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { PhotoIcon, CloudArrowUpIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import type { ImageFile } from '../../types'
import Button from '../ui/Button'

interface FileUploaderProps {
  onFilesSelected: (files: ImageFile[]) => void
  onConvertAndDownload?: () => void
  hasFiles?: boolean
  isProcessing?: boolean
  maxFiles?: number
  maxSize?: number
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  onConvertAndDownload,
  hasFiles = false,
  isProcessing = false,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024 // 10MB
}) => {
  const [error, setError] = useState<string>('')

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('')

    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0]
      setError(`File rejected: ${error.message}`)
      return
    }

    const imageFiles: ImageFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      originalFormat: file.type.split('/')[1],
      targetFormat: 'jpeg',
      quality: 90
    }))

    onFilesSelected(imageFiles)
  }, [onFilesSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif', '.bmp', '.tiff', '.svg']
    },
    maxFiles,
    maxSize,
    multiple: true
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${isDragActive ? 'bg-primary-100' : 'bg-gray-100'}`}>
            {isDragActive ? (
              <CloudArrowUpIcon className="w-12 h-12 text-primary-600" />
            ) : (
              <PhotoIcon className="w-12 h-12 text-gray-600" />
            )}
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click to browse files
            </p>
          </div>
          
          <div className="text-xs text-gray-400">
            <p>Supports: JPEG, PNG, WebP, GIF, BMP, TIFF, SVG</p>
            <p>Max size: {Math.round(maxSize / (1024 * 1024))}MB per file</p>
            <p>Max files: {maxFiles}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {/* Convert & Download Button */}
      {hasFiles && (
        <div className="mt-4">
          <Button
            onClick={onConvertAndDownload}
            disabled={isProcessing || !hasFiles}
            isLoading={isProcessing}
            variant="primary"
            fullWidth
          >
            <div className="flex items-center justify-center">
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              {isProcessing ? 'Converting...' : 'Convert & Download Images'}
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}

export default FileUploader