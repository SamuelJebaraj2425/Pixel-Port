import React, { useState, useCallback, useEffect } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import FileUploader from './components/converter/FileUploader'
// import ImagePreview removed
import ConversionSettings from './components/converter/ConversionSettings'

import Button from './components/ui/Button'
import type { ImageFile, ConversionSettings as ConversionSettingsType, ConversionResult } from './types'
import { useImageConverter } from './hooks/useImageConverter'
import { downloadMultipleFiles } from './utils/downloadUtils'

const App: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([])
  const [conversionResults, setConversionResults] = useState<ConversionResult[]>([])
  const [showPopup, setShowPopup] = useState(false)

  
  const [globalSettings, setGlobalSettings] = useState<ConversionSettingsType>({
    format: 'jpeg',
    quality: 90,
    maintainAspectRatio: true,
    resizeMode: 'contain'
  })

  const { convertImages } = useImageConverter()
  
  // Debug: Log when imageFiles changes
  useEffect(() => {
    console.log('imageFiles updated:', imageFiles)
  }, [imageFiles])


  // When files are selected, set their targetFormat to the current globalSettings.format
  const handleFilesSelected = useCallback((files: ImageFile[]) => {
    console.log('handleFilesSelected called with:', files);
    const updatedFiles = files.map(file => ({
      ...file,
      lastModified: (file.file && file.file.lastModified) || (file.lastModified ?? Date.now()),
      targetFormat: globalSettings.format,
      quality: globalSettings.quality
    }))
    setImageFiles(prev => {
      // Only add files that are not already present (by name, size, lastModified, and type)
      const existing = new Set(prev.map(f => `${f.name}_${f.type}_${f.size}_${f.lastModified}`))
      const deduped = updatedFiles.filter(f => !existing.has(`${f.name}_${f.type}_${f.size}_${f.lastModified}`))
      return [...prev, ...deduped]
    })
  }, [globalSettings])

  // When output format changes, update all imageFiles' targetFormat
  const handleSettingsChange = (settings: ConversionSettingsType) => {
    setGlobalSettings(settings)
    setImageFiles(prev => prev.map(file => ({ ...file, targetFormat: settings.format })))
  }



  const handleConvertAll = async () => {
    console.log('handleConvertAll called. imageFiles:', imageFiles);
    if (imageFiles.length === 0) {
      console.warn('No images to convert.');
      return;
    }

    try {
      const results = await convertImages(imageFiles, globalSettings)
      setConversionResults(results)
      
      // Automatically download the converted images
      if (results.length > 0) {
        downloadMultipleFiles(results)
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
      }
    } catch (error) {
      console.error('Conversion failed:', error)
      alert('Some conversions failed. Please try again.')
    }
  }



  const handleDownloadAll = async () => {
    if (conversionResults.length === 0) return
    downloadMultipleFiles(conversionResults)
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
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex flex-col">
      <Header 
        onDownloadAll={handleDownloadAll}
        showDownloadAll={conversionResults.length > 0}
        conversionCount={conversionResults.length}
      />

      <main className="flex-1 flex flex-col items-center justify-center pt-4 pb-8 max-[420px]:pt-2 max-[420px]:pb-6 px-4">
        <div className="w-full max-w-4xl min-h-[28rem] bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col min-[421px]:flex-row overflow-hidden border border-gray-200">
          {/* FileUploader above on mobile (<420px), left on desktop */}
          <div className="order-1 min-[421px]:order-none min-[421px]:flex-1 p-4 min-[421px]:p-8 flex flex-col justify-center h-full min-[421px]:min-h-[24rem]">
            <FileUploader
              onFilesSelected={handleFilesSelected}
              files={imageFiles}
            />
          </div>
          <div className="hidden min-[421px]:block w-px bg-gray-200" />
          <div className="order-2 min-[421px]:order-none min-[421px]:flex-1 p-4 min-[421px]:p-8 flex flex-col justify-center h-full min-[421px]:min-h-[24rem]">
            <ConversionSettings
              settings={globalSettings}
              onChange={handleSettingsChange}
              imageCount={imageFiles.length}
              onGenerate={handleConvertAll}
              showPopup={showPopup}
            />
          </div>
        </div>

        {/* Action Buttons */}
        {imageFiles.length > 0 && conversionResults.length > 0 && (
          <div className="flex justify-between items-center mt-8 w-full max-w-4xl">
            <div className="text-sm text-green-600 ml-2">
              {conversionResults.length} converted
            </div>
          </div>
        )}

        {/* Image Grid */}
        {imageFiles.length > 0 && (
          <div className="w-full max-w-4xl mt-8">
            {/* Removed Images heading as per user request */}
            {/* Uploaded Images List - moved here */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-md font-semibold text-gray-800">Uploaded Images</h4>
                <Button
                  onClick={handleClearAll}
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Clear All
                </Button>
              </div>
              <ul className="divide-y divide-gray-200 bg-white/60 rounded-lg shadow-sm">
                {imageFiles.map((file) => (
                  <li
                    key={`${file.name}_${file.type}_${file.size}_${file.lastModified}`}
                    className="grid grid-cols-12 gap-2 items-center px-4 py-2"
                  >
                    <span className="col-span-6 truncate max-w-xs text-gray-700" title={file.name}>{file.name}</span>
                    <span className="col-span-2 text-xs text-gray-500 text-right">{(file.size / 1024).toFixed(1)} KB</span>
                    <span className="col-span-2 text-xs text-gray-500 text-center uppercase">{file.type || 'Unknown'}</span>
                    <span className="col-span-2 flex justify-end">
                      <button
                        className="min-[421px]:px-2 min-[421px]:py-1 p-1.5 text-xs text-red-500 hover:text-white hover:bg-red-500 rounded transition-colors border border-red-200 flex items-center"
                        title="Delete image"
                        onClick={() => {
                          URL.revokeObjectURL(file.url)
                          setImageFiles(prev => prev.filter(f => f.url !== file.url))
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 min-[421px]:hidden" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="hidden min-[421px]:inline">Delete</span>
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* ImagePreview grid removed */}
            </div>
          </div>
        )}
        {/* Empty State */}
        {imageFiles.length === 0 && (
          <div className="w-full max-w-4xl text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mt-10 mb-4">
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
      </main>
      <Footer />
    </div>
  )
}

export default App
