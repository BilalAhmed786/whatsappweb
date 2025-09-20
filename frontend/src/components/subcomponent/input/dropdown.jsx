import React, { useEffect, useRef, useState } from 'react'
import { FaPlus } from 'react-icons/fa';
const dropdown = ({setImages,images,setVideos,videos,setDocuments,documents}) => {
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
        <div className="relative z-50 flex items-center mx-2 text-xl cursor-pointer text-blue-800">
            <FaPlus onClick={toggleDropdown} />
            <div
                ref={dropdownRef}
                className={`absolute left-0 bg-white border py-2 shadow-lg rounded-lg transition-transform duration-300 ease-in ${showDropdown ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}
                style={{ top: '-200px', transformOrigin: 'top center' }}
            >
                <ul>
                    <div className='block w-full  cursor-pointer' onClick={handleDocumentClick}>
                        <li className="hover:bg-gray-100 px-6 py-2">
                            <label className='w-full text-black text-[16px]' onClick={(e) => e.stopPropagation()}>
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
                    <div className='block w-full cursor-pointer' onClick={handleImgClick}>
                        <li className="hover:bg-gray-100 px-6 py-2">
                            <label className='w-full text-black text-[16px]' onClick={(e) => e.stopPropagation()}>
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
                    <div className='block w-full cursor-pointer' onClick={handleVideoClick}>
                        <li className="hover:bg-gray-100 px-6 py-2">
                            <label className='w-full text-black text-[16px]' onClick={(e) => e.stopPropagation()}>
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
    )
}

export default dropdown