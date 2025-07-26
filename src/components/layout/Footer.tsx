import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Image Converter. Built with React & Tailwind CSS.</p>
          <p className="mt-2">
            Supports JPEG, PNG, WebP, BMP, ICO formats • Client-side processing • No data sent to servers
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer