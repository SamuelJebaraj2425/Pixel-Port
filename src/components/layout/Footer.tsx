import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Pixel Port. Built with React & Tailwind CSS.</p>
          <p className="mt-2">
            Supports JPEG, PNG, WebP, BMP, ICO formats 
          </p>
        </div>
        <div className="mt-2 flex justify-center space-x-6">
          <a href="https://www.linkedin.com/in/samuel-jebaraj-a10136217" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700" title="LinkedIn">
            <svg className="inline w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
          </a>
          <a href="https://github.com/SamuelJebaraj2425" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900" title="GitHub">
            <svg className="inline w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.262.82-.582 0-.288-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.404 1.02.005 2.04.137 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.625-5.475 5.922.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.218.698.825.58C20.565 21.797 24 17.297 24 12c0-6.63-5.373-12-12-12z"/></svg>
          </a>
          <a href="mailto:samuel.jebaraj@email.com" className="hover:text-red-600" title="Email">
            <svg className="inline w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 13.065l-11.99-7.065v14c0 1.104.896 2 2 2h19.98c1.104 0 2-.896 2-2v-14l-11.99 7.065zm11.99-9.065c0-1.104-.896-2-2-2h-19.98c-1.104 0-2 .896-2 2v.217l12 7.083 12-7.083v-.217z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer