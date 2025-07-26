import React, { useState, useCallback, useEffect } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import FileUploader from './components/converter/FileUploader'
import ImagePreview from './components/converter/ImagePreview'
import ConversionSettings from './components/converter/ConversionSettings'
import ProgressBar from './components/converter/ProgressBar'
import Button from './components/ui/Button'
import type { ImageFile, ConversionSettings as ConversionSettingsType, ConversionResult } from './types'
import { useImageConverter } from './hooks/useImageConverter'
import { downloadSingleFile, downloadMultipleFiles } from './utils/downloadUtils'

const App: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([])
  const [conversionResults, setConversionResults] = useState<ConversionResult[]>([])
  const [showSettings, setShowSettings] = useState(true)
  
  const [globalSettings, setGlobalSettings] = useState<ConversionSettingsType>({
    format: 'jpeg',
    quality: 90,
    maintainAspectRatio: true,
    resizeMode: 'contain'
  })

  const { convertImages, isProcessing, progress } = useImageConverter()
  
  // Debug: Log when imageFiles changes
  useEffect(() => {
    console.log('imageFiles updated:', imageFiles)
  }, [imageFiles])

  const handleFilesSelected = useCallback((files: ImageFile[]) => {
    const updatedFiles = files.map(file => ({
      ...file,
      targetFormat: globalSettings.format,
      quality: globalSettings.quality
    }))
    console.log('Files selected:', updatedFiles)
    setImageFiles(prev => [...prev, ...updatedFiles])
  }, [globalSettings])

  const handleRemoveFile = useCallback((id: string) => {
    setImageFiles(prev => prev.filter(file => file.id !== id))
    setConversionResults(prev => prev.filter(result => result.id !== id))
  }, [])

  const handleConvertAll = async () => {
    if (imageFiles.length === 0) return

    try {
      const results = await convertImages(imageFiles, globalSettings)
      setConversionResults(results)
      
      // Automatically download the converted images
      if (results.length > 0) {
        downloadMultipleFiles(results)
      }
    } catch (error) {
      console.error('Conversion failed:', error)
      alert('Some conversions failed. Please try again.')
    }
  }

  const handleDownloadSingle = (result: ConversionResult) => {
    downloadSingleFile(result)
  }

  const handleDownloadAll = async () => {
    if (conversionResults.length === 0) return
    downloadMultipleFiles(conversionResults)
  }

  const handlePreview = (imageFile: ImageFile) => {
    // Implementation for image preview modal
    console.log('Preview:', imageFile)
    // In a real implementation, this would open a modal with a larger preview
  }

  const handleClearAll = () => {
    imageFiles.forEach(file => URL.revokeObjectURL(file.url))
    conversionResults.forEach(result => {
      URL.revokeObjectURL(result.convertedUrl)
    })
    setImageFiles([])
    setConversionResults([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onToggleSettings={() => setShowSettings(!showSettings)}
        onDownloadAll={handleDownloadAll}
        showDownloadAll={conversionResults.length > 0}
        conversionCount={conversionResults.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Panel */}
          {showSettings && (
            <div className="lg:col-span-1">
              <ConversionSettings
                settings={globalSettings}
                onChange={setGlobalSettings}
              />
            </div>
          )}

          {/* Main Content */}
          <div className={`${showSettings ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            <div className="space-y-8">
              {/* File Uploader */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Images</h2>
                <FileUploader
                  onFilesSelected={handleFilesSelected}
                  onConvertAndDownload={handleConvertAll}
                  hasFiles={imageFiles.length > 0}
                  isProcessing={isProcessing}
                />
              </div>

              {/* Action Buttons */}
              {imageFiles.length > 0 && (
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {imageFiles.length} image{imageFiles.length > 1 ? 's' : ''} selected
                    {conversionResults.length > 0 && (
                      <span className="ml-2 text-green-600">
                        • {conversionResults.length} converted
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleClearAll}
                      variant="ghost"
                    >
                      Clear All
                    </Button>
                    
                    <Button
                      onClick={handleConvertAll}
                      disabled={isProcessing || imageFiles.length === 0}
                      isLoading={isProcessing}
                      variant="primary"
                    >
                      {isProcessing ? 'Converting...' : 'Convert & Download'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              {isProcessing && (
                <div className="mt-4">
                  <ProgressBar progress={progress} />
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Converting images... {Math.round(progress)}%
                    <br />
                    <span className="text-xs text-primary-500">Images will be downloaded automatically after conversion</span>
                  </p>
                </div>
              )}

              {/* Image Grid */}
              {imageFiles.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {imageFiles.map(imageFile => {
                      const result = conversionResults.find(r => r.id === imageFile.id)
                      return (
                        <ImagePreview
                          key={imageFile.id}
                          imageFile={imageFile}
                          conversionResult={result}
                          onRemove={handleRemoveFile}
                          onDownload={handleDownloadSingle}
                          onPreview={handlePreview}
                        />
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {imageFiles.length === 0 && (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="mb-4">
                      <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No images uploaded</h3>
                    <p className="text-gray-500">
                      Upload images using the form above to get started with conversion.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
