import React, { useRef } from 'react';
import { FaTrashAlt, FaPaperPlane, FaFileAlt, FaVideo, FaMicrophone } from 'react-icons/fa';

const Previewmedia = ({
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

  const hasMedia = images.length > 0 || documents.length > 0 || videos.length > 0 || recording;

  if (!hasMedia) return null;

  return (
    <div className="relative max-h-[250px] px-4 py-3 flex items-center justify-between overflow-auto custom-scrollbar bg-slate-900/90 backdrop-blur-xl border-t border-slate-800/80 rounded-b-xl shadow-inner">
      <div className="flex flex-wrap items-center gap-4 w-full pr-12">
        {/* Image Previews */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-700/60 shadow-md">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index}`}
                  className="h-[90px] w-[90px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1.5 rounded-full bg-slate-900/80 hover:bg-rose-600 text-slate-300 hover:text-white backdrop-blur-sm transition-all duration-200"
                  aria-label="Remove image"
                >
                  <FaTrashAlt className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Document Previews */}
        {documents.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {documents.map((document, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200 shadow-sm"
              >
                <FaFileAlt className="text-cyan-400 text-sm flex-shrink-0" />
                <span className="text-xs font-medium truncate max-w-[140px]">
                  {document.name}
                </span>
                <button
                  onClick={() => removeDocument(index)}
                  className="p-1 rounded bg-slate-700/50 hover:bg-rose-600/80 text-slate-400 hover:text-white transition-all ml-1"
                  aria-label="Remove document"
                >
                  <FaTrashAlt className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Video Previews */}
        {videos.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {videos.map((video, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-700/60 shadow-md">
                <video
                  src={URL.createObjectURL(video)}
                  className="h-[100px] w-[140px] object-cover bg-black/40"
                  controls
                />
                <button
                  onClick={() => removeVideo(index)}
                  className="absolute top-1 right-1 p-1.5 rounded-full bg-slate-900/80 hover:bg-rose-600 text-slate-300 hover:text-white backdrop-blur-sm transition-all duration-200 z-10"
                  aria-label="Remove video"
                >
                  <FaTrashAlt className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Audio Recording Preview */}
        {recording && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-md">
            <FaMicrophone className="text-rose-400 text-base animate-pulse" />
            <audio 
              controls
              className="max-w-[180px] sm:max-w-[260px] md:max-w-[300px] h-8 accent-cyan-500"
              ref={audioRef}
            >
              <source src={URL.createObjectURL(recording)} type="audio/webm" />
            </audio>
            <button
              onClick={removeRecording}
              className="p-1.5 rounded-full bg-slate-700/50 hover:bg-rose-600 text-slate-300 hover:text-white transition-all duration-200"
              aria-label="Remove recording"
            >
              <FaTrashAlt className="text-xs" />
            </button>
          </div>
        )}
      </div>

      {/* Action Send Button */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <button
          onClick={handleSend}
          className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center"
          aria-label="Send Media"
        >
          <FaPaperPlane className="text-sm -translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default Previewmedia;