export interface ImageFile {
  id: string
  file: File
  name: string
  size: number
  type: string
  url: string
  originalFormat: string
  targetFormat: string
  quality: number
  width?: number
  height?: number
  originalWidth?: number
  originalHeight?: number
  lastModified?: number
}

export interface ConversionResult {
  id: string
  originalFile: ImageFile
  convertedBlob: Blob
  convertedUrl: string
  originalSize: number
  convertedSize: number
  compressionRatio: number
  processingTime: number
}

export interface ConversionSettings {
  format: ImageFormat
  quality: number
  width?: number
  height?: number
  maintainAspectRatio: boolean
  resizeMode: 'contain' | 'cover' | 'stretch'
}

export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'bmp' | 'ico'

export interface ProcessingStatus {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
  error?: string
}