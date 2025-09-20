import { backendbaseurl } from "../baseurl/baseurl";

const replymultiplemedia = (media, setReply) => {
  const exact1files = media.slice(0, 1);
  const extraCount = media.length - exact1files.length;

  const renderMedia = () => {
    return (
      <div className="absolute bg-gray-700 border-l-4 border-red-500 p-3 opacity-90 z-40 -top-48 -left-1 w-full h-[190px] flex flex-wrap gap-4 rounded-md overflow-auto">
        <button
          className="absolute text-white right-3 top-2"
          onClick={() => setReply("")}
        >
          X
        </button>

        {exact1files.map((file, index) => {
          const fileType = file.text.split(".").pop().toLowerCase();

          // IMAGE
          if (["jpg", "jpeg", "png", "gif"].includes(fileType)) {
            return (
              <div key={index} className="relative">
                <img
                  src={`${backendbaseurl}/images/${file.text}`}
                  alt={`media-${index}`}
                  className="w-40 h-40 rounded-lg cursor-pointer object-cover"
                />
                {index === exact1files.length - 1 && extraCount > 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg text-white text-2xl font-bold">
                    +{extraCount}
                  </div>
                )}
              </div>
            );
          }

          // VIDEO
          if (["mp4", "avi", "mov"].includes(fileType)) {
            return (
              <div key={index} className="relative">
                <video
                  controls
                  className="w-40 h-40 rounded-lg cursor-pointer object-cover"
                >
                  <source
                    src={`${backendbaseurl}/videos/${file.text}`}
                    type={`video/${fileType}`}
                  />
                  Your browser does not support the video element.
                </video>
                {index === exact1files.length - 1 && extraCount > 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg text-white text-2xl font-bold">
                    +{extraCount}
                  </div>
                )}
              </div>
            );
          }

          // AUDIO
          if (["mp3", "webm", "ogg"].includes(fileType)) {
            return (
              <div key={index} className="w-full text-white flex items-center gap-2">
              
                <audio controls className="flex-1">
                  <source
                    src={`${backendbaseurl}/audio/${file.text}`}
                    type={`audio/${fileType}`}
                  />
                  Your browser does not support the audio element.
                </audio>
              </div>
            );
          }

          if (["pdf", "doc", "docx"].includes(fileType)) {
            return (
              <a
                key={index}
                href={`${backendbaseurl}/documents/${file.text}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-bold text-white underline"
              >
                 {file.text}
              </a>
            );
          }

          return null;
        })}
      </div>
    );
  };

  return renderMedia();
};

export default replymultiplemedia;
