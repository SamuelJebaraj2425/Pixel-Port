import React, { useRef, useState } from 'react'
import { PhotoIcon } from '@heroicons/react/24/outline'
import type { ImageFile } from '../../types'


interface FileUploaderProps {
  onFilesSelected: (files: ImageFile[]) => void
  files?: ImageFile[]
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  files = []
}) => {
  const [error, setError] = useState<string>('')
  const [isDragActive, setIsDragActive] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  // Generate a simple PNG image using canvas and download it



  // File input handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    const fileList = e.target.files;
    if (!fileList) return;
    handleFiles(Array.from(fileList));
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  // Common handler for both input and drop
  const handleFiles = (fileList: File[]) => {
    const acceptedFiles = fileList.filter(file => file.type.startsWith('image/'));
    if (acceptedFiles.length === 0) {
      setError('Please select a valid image file.');
      return;
    }
    const imageFiles: ImageFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      originalFormat: file.type.split('/')[1],
      targetFormat: file.type.split('/')[1],
      quality: 90,
      lastModified: file.lastModified
    }));
    onFilesSelected(imageFiles);
  };

  return (
    <div className="w-[280px] sm:max-w-sm h-full flex flex-col justify-center items-center mx-auto">
      <label
        htmlFor="file-upload"
        className={`w-full h-40 sm:h-48 flex flex-col justify-center items-center border-2 border-dashed rounded-xl cursor-pointer transition bg-white/60 ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-blue-200 hover:border-blue-400'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center pointer-events-none">
          <PhotoIcon className="w-16 h-16 text-blue-300 mb-2" />
          <span className="text-lg font-medium text-blue-900">Drop your image here, or <span className="text-blue-500 underline">browse</span></span>
          <span className="text-sm text-blue-400 mt-1">Supports: JPG, JPEG2000, PNG</span>
        </div>
        <input
          id="file-upload"
          type="file"
          accept="image/jpeg,image/png,image/jp2,image/jpx,image/j2k,image/jpf"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-md w-full text-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
      {/* Status/Completed area (optional) */}
      {files.length > 0 && (
        <div className="w-full mt-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between px-6 py-4">
          <span className="font-medium text-blue-900">Uploaded</span>
          <span className="text-green-500">
            <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#E6F9F0"/><path stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10 17l4 4 8-8"/></svg>
          </span>
        </div>
      )}
    </div>
  )
}

export default FileUploader