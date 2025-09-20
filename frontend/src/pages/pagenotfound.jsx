import React from 'react'
import { frontendbaseurl } from '../baseurl/baseurl'
const pagenotfound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <h1 className="text-6xl font-bold text-gray-800">404</h1>
    <p className="text-2xl mt-4 text-gray-600">Page Not Found</p>
    <p className="mt-2 text-gray-500">Sorry, the page you're looking for doesn't exist.</p>
    <a
      href={frontendbaseurl}
      className="mt-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
    >
      Go to Homepage
    </a>
  </div>
  )
}

export default pagenotfound