import { useState, useCallback } from 'react'
import type { ImageFile, ConversionSettings, ConversionResult } from '../types'
import { ImageConverter } from '../utils/imageConverter'

export const useImageConverter = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [converter] = useState(() => new ImageConverter())

  const convertImages = useCallback(async (
    imageFiles: ImageFile[],
    globalSettings: ConversionSettings
  ): Promise<ConversionResult[]> => {
    setIsProcessing(true)
    setProgress(0)
    
    const results: ConversionResult[] = []
    
    try {
      for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i]
        
        const settings: ConversionSettings = {
          format: imageFile.targetFormat as any,
          quality: imageFile.quality,
          width: globalSettings.width,
          height: globalSettings.height,
          maintainAspectRatio: globalSettings.maintainAspectRatio,
          resizeMode: globalSettings.resizeMode
        }

        const result = await converter.convertImage(imageFile, settings)
        results.push(result)
        
        // Update progress
        setProgress(((i + 1) / imageFiles.length) * 100)
      }
      
      return results
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }, [converter])

  return {
    convertImages,
    isProcessing,
    progress
  }
}