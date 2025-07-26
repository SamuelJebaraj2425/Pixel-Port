import JSZip from 'jszip'
import type { ConversionResult } from '../types'

export const downloadSingleFile = (result: ConversionResult) => {
  const link = document.createElement('a')
  link.href = result.convertedUrl
  link.download = generateFileName(result)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const downloadMultipleFiles = async (results: ConversionResult[]) => {
  const zip = new JSZip()
  
  results.forEach(result => {
    const filename = generateFileName(result)
    zip.file(filename, result.convertedBlob)
  })

  const zipBlob = await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(zipBlob)
  link.download = `converted_images_${new Date().toISOString().split('T')[0]}.zip`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Cleanup
  URL.revokeObjectURL(link.href)
}

const generateFileName = (result: ConversionResult): string => {
  const baseName = result.originalFile.name.split('.').slice(0, -1).join('.')
  const extension = result.originalFile.targetFormat
  return `${baseName}.${extension}`
}