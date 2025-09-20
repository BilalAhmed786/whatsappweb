import React, { useRef } from 'react'
import { FaTrashAlt,FaPaperPlane } from 'react-icons/fa';
const previewmedia = ({
  images,
  documents,
  videos,
  recording,    
  handleSend,
  setRecording,
  setRecordingTime,
  setImages,
  setVideos,
  setDocuments,
  mediaRecorderRef,
  audioChunksRef 

}) => {

  const audioRef = useRef(null); 

  const removeRecording = () => {
    setRecording(null);
    setRecordingTime(0);
    audioChunksRef.current = [];
    mediaRecorderRef.current = null;
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };




  return (
     <div className="relative max-h-[250px] px-4 flex items-center justify-between overflow-auto">
              {images.length > 0 && (
                <div className="flex flex-wrap gap-3 m-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative h-full flex-shrink-0">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index}`}
                        className="h-[100px] w-[100px] object-cover"
                      />
                      <FaTrashAlt
                        className="absolute top-0 right-0 text-red-600 cursor-pointer"
                        onClick={() => removeImage(index)}
                      />
                    </div>
                  ))}
                </div>
    
              )}
              {documents.length > 0 && (
                <div className="flex flex-wrap gap-5 m-3">
                  {documents.map((document, index) => (
                    <div key={index} className="relative flex justify-center items-center">
                      <span className="block">{document.name}</span>
                      <FaTrashAlt
                        className="ml-2 text-red-600 cursor-pointer"
                        onClick={() => removeDocument(index)}
                      />
                    </div>
                  ))}
                </div>
              )}
              {videos.length > 0 && (
                <div className="flex flex-wrap gap-5 m-3">
                  {videos.map((video, index) => (
                    <div key={index} className="relative h-full">
                      <video
                        src={URL.createObjectURL(video)}
                        className="h-[150px] w-[150px] object-cover"
                        controls
                      />
                      <FaTrashAlt
                        className="absolute top-0 right-0 text-red-600 cursor-pointer"
                        onClick={() => removeVideo(index)}
                      />
                    </div>
                  ))}
                </div>
              )}
              {recording && (
                <div className="w-full h-40 bg-white flex items-center justify-start px-3 space-x-4 shadow-lg">
    
                  <audio controls
                    className='max-w-[150px] lg:max-w-[320px] md:max-w-[260px]'
                    ref={audioRef}>
                    <source src={URL.createObjectURL(recording)} type="audio/webm" />
                  </audio>
                  <FaTrashAlt
                    className="ml-2 text-red-600 cursor-pointer"
                    onClick={removeRecording}
                  />
                </div>
              )}
              {images.length > 0 || documents.length > 0 || videos.length > 0 || recording ?
                <div>
                  <button
                    className='text-blue-700 text-xl'
                    onClick={handleSend}>
                    <FaPaperPlane />
                  </button>
                </div>
                : ''
              }
    
            </div>
  )
}

export default previewmedia