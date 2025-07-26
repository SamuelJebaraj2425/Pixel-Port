import type { ImageFile, ConversionSettings, ConversionResult } from '../types'

export class ImageConverter {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor() {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')!
  }

  async convertImage(
    imageFile: ImageFile,
    settings: ConversionSettings
  ): Promise<ConversionResult> {
    const startTime = performance.now()

    try {
      // Load image
      const img = await this.loadImage(imageFile.url)
      
      // Calculate dimensions
      const dimensions = this.calculateDimensions(
        img.width,
        img.height,
        settings
      )

      // Set canvas size
      this.canvas.width = dimensions.width
      this.canvas.height = dimensions.height

      // Clear canvas
      this.ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      // Draw image with proper scaling
      this.drawImageWithResize(img, dimensions, settings.resizeMode)

      // Convert to target format
      const convertedBlob = await this.canvasToBlob(
        settings.format,
        settings.quality
      )

      const convertedUrl = URL.createObjectURL(convertedBlob)
      const processingTime = performance.now() - startTime

      return {
        id: imageFile.id,
        originalFile: imageFile,
        convertedBlob,
        convertedUrl,
        originalSize: imageFile.size,
        convertedSize: convertedBlob.size,
        compressionRatio: ((imageFile.size - convertedBlob.size) / imageFile.size) * 100,
        processingTime
      }
    } catch (error) {
      throw new Error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })
  }

  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    settings: ConversionSettings
  ) {
    let { width, height } = settings

    if (!width && !height) {
      return { width: originalWidth, height: originalHeight }
    }

    if (settings.maintainAspectRatio) {
      const aspectRatio = originalWidth / originalHeight

      if (width && !height) {
        height = Math.round(width / aspectRatio)
      } else if (height && !width) {
        width = Math.round(height * aspectRatio)
      } else if (width && height) {
        // Use the smaller scaling factor to maintain aspect ratio
        const scaleX = width / originalWidth
        const scaleY = height / originalHeight
        const scale = Math.min(scaleX, scaleY)
        
        width = Math.round(originalWidth * scale)
        height = Math.round(originalHeight * scale)
      }
    }

    return {
      width: width || originalWidth,
      height: height || originalHeight
    }
  }

  private drawImageWithResize(
    img: HTMLImageElement,
    dimensions: { width: number; height: number },
    resizeMode: 'contain' | 'cover' | 'stretch'
  ) {
    const { width, height } = dimensions

    switch (resizeMode) {
      case 'stretch':
        this.ctx.drawImage(img, 0, 0, width, height)
        break

      case 'contain':
        const scaleContain = Math.min(width / img.width, height / img.height)
        const newWidthContain = img.width * scaleContain
        const newHeightContain = img.height * scaleContain
        const xContain = (width - newWidthContain) / 2
        const yContain = (height - newHeightContain) / 2

        this.ctx.drawImage(img, xContain, yContain, newWidthContain, newHeightContain)
        break

      case 'cover':
        const scaleCover = Math.max(width / img.width, height / img.height)
        const newWidthCover = img.width * scaleCover
        const newHeightCover = img.height * scaleCover
        const xCover = (width - newWidthCover) / 2
        const yCover = (height - newHeightCover) / 2

        this.ctx.drawImage(img, xCover, yCover, newWidthCover, newHeightCover)
        break
    }
  }

  private canvasToBlob(format: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const mimeType = this.getMimeType(format)
      const qualityValue = format === 'png' ? undefined : quality / 100

      this.canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to create blob'))
          }
        },
        mimeType,
        qualityValue
      )
    })
  }

  private getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      jpeg: 'image/jpeg',
      jpg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      bmp: 'image/bmp',
      ico: 'image/x-icon'
    }
    return mimeTypes[format] || 'image/png'
  }
}

// Utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getSupportedFormats = () => {
  return [
    { value: 'jpeg', label: 'JPEG', extension: '.jpg' },
    { value: 'png', label: 'PNG', extension: '.png' },
    { value: 'webp', label: 'WebP', extension: '.webp' },
    { value: 'bmp', label: 'BMP', extension: '.bmp' },
    { value: 'ico', label: 'ICO', extension: '.ico' }
  ]
}