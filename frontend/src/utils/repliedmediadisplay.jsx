import { backendbaseurl } from "../baseurl/baseurl";

const repliedmediadisplay = (media) => {
  if (!media || media.length === 0) return null;

  const visibleMedia = media.slice(0, 4);
  const extraCount = media.length - 4;

  return (
    <div
      className={`grid gap-2 ${visibleMedia.length > 1 ? "grid-cols-2" : "grid-cols-1"
        } rounded-md mt-4 opacity-50 z-0 border-l-4 border-red-500 bg-slate-300`}
    >
      {visibleMedia.map((file, index) => {
        const fileType = file.text.split(".").pop().toLowerCase();
        const isLastVisible = index === visibleMedia.length - 1 && extraCount > 0;
        const overlay = isLastVisible && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-lg font-bold rounded-lg">
            +{extraCount}
          </div>
        );

        if (["jpg", "jpeg", "png", "gif"].includes(fileType)) {
          return (
            <div key={index} className="relative">
              <img
                src={`${backendbaseurl}/images/${file.text}`}
                alt={`media-${index}`}
                className={`${visibleMedia.length !== 1 ? "w-40 h-40" : "w-80 h-80"
                  } rounded-lg mt-2 cursor-pointer object-cover`}
              />
              {overlay}
            </div>
          );
        }

        // Videos
        if (["mp4", "avi", "mov"].includes(fileType)) {
          return (
            <div key={index} className="relative">
              <video
                controls
                className={`${visibleMedia.length !== 1 ? "w-40 h-40" : "w-80 h-80"
                  } rounded-lg mt-2 cursor-pointer object-cover`}
              >
                <source
                  src={`${backendbaseurl}/videos/${file.text}`}
                  type={`video/${fileType}`}
                />
              </video>
              {overlay}
            </div>
          );
        }

        // Audio
        if (["mp3", "webm", "ogg"].includes(fileType)) {
          return (
            <audio
              key={index}
              controls
              className="max-w-[100%]"
            >
              <source
                src={`${backendbaseurl}/audio/${file.text}`}
                type={`audio/${fileType}`}
              />
            </audio>
          );
        }

        // Documents
        if (["pdf", "doc", "docx"].includes(fileType)) {
          return (
            <a
              key={index}
              href={`${backendbaseurl}/documents/${file.text}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-red-500 inline"
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

export default repliedmediadisplay;
