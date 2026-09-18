import React, { useEffect, useRef, useState } from 'react';
import { FaPlus, FaFileAlt, FaImage, FaVideo } from 'react-icons/fa';

const dropdown = ({ setImages, images, setVideos, videos, setDocuments, documents }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const documentRef = useRef(null);
  const imgRef = useRef(null);
  const videoRef = useRef(null);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  
  const handleDocumentClick = () => {
    documentRef.current.click();
  };

  const handleImgClick = () => {
    imgRef.current.click();
  };

  const handleVideoClick = () => {
    videoRef.current.click();
  };

  const handleDocumentChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validDocuments = selectedFiles.filter((file) => file.type === 'application/pdf' || file.type === 'application/msword');

    if (validDocuments.length) {
      setDocuments([...documents, ...validDocuments]);
    } else {
      alert('Only PDF and DOC files are allowed!');
    }
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validImages = selectedFiles.filter((file) => file.type === 'image/jpeg' || file.type === 'image/png');

    if (validImages.length) {
      setImages([...images, ...validImages]);
    } else {
      alert('Only JPG and PNG images are allowed!');
    }
  };

  const handleVideoChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validVideos = selectedFiles.filter((file) => file.type === 'video/mp4');

    if (validVideos.length) {
      setVideos([...videos, ...validVideos]);
    } else {
      alert('Only MP4 videos are allowed!');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-50 flex items-center">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className={`p-2 rounded-full transition-all duration-200 flex items-center justify-center ${
          showDropdown 
            ? 'bg-indigo-500/20 text-indigo-400 rotate-45' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
        }`}
      >
        <FaPlus className="text-lg transition-transform" />
      </button>

      {/* Dropdown Menu */}
      <div
        ref={dropdownRef}
        className={`absolute bottom-[130%] left-0 w-48 bg-slate-900 border border-slate-700/80 shadow-xl rounded-xl py-2 transition-all duration-200 ease-out origin-bottom-left ${
          showDropdown 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
        }`}
      >
        <ul className="flex flex-col gap-1 px-1">
          {/* Documents Option */}
          <div className="block w-full cursor-pointer group" onClick={handleDocumentClick}>
            <li className="hover:bg-slate-800/80 rounded-lg px-3 py-2 transition-colors">
              <label className="w-full flex items-center gap-3 text-slate-300 group-hover:text-slate-100 text-sm font-medium cursor-pointer" onClick={(e) => e.stopPropagation()}>
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <FaFileAlt />
                </div>
                Documents
                <input
                  ref={documentRef}
                  type="file"
                  accept=".pdf,.doc"
                  multiple
                  onChange={handleDocumentChange}
                  className="hidden"
                />
              </label>
            </li>
          </div>

          {/* Images Option */}
          <div className="block w-full cursor-pointer group" onClick={handleImgClick}>
            <li className="hover:bg-slate-800/80 rounded-lg px-3 py-2 transition-colors">
              <label className="w-full flex items-center gap-3 text-slate-300 group-hover:text-slate-100 text-sm font-medium cursor-pointer" onClick={(e) => e.stopPropagation()}>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <FaImage />
                </div>
                Images
                <input
                  ref={imgRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </li>
          </div>

          {/* Videos Option */}
          <div className="block w-full cursor-pointer group" onClick={handleVideoClick}>
            <li className="hover:bg-slate-800/80 rounded-lg px-3 py-2 transition-colors">
              <label className="w-full flex items-center gap-3 text-slate-300 group-hover:text-slate-100 text-sm font-medium cursor-pointer" onClick={(e) => e.stopPropagation()}>
                <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                  <FaVideo />
                </div>
                Videos
                <input
                  ref={videoRef}
                  type="file"
                  accept=".mp4"
                  multiple
                  onChange={handleVideoChange}
                  className="hidden"
                />
              </label>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default dropdown;