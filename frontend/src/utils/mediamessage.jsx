import { useState } from "react";
import { format } from "timeago.js";
import axios from "axios";
import { backendbaseurl } from "../baseurl/baseurl";

const Mediamessage = ({ media, msgid, sender, openMediaViewer, loginuser }) => {

  const renderMediaGrid = () => {
    const visibleMedia = media.filter(file =>
      ["jpg", "jpeg", "png", "gif", "mp4", "avi", "mov"].includes(file.text.split(".").pop().toLowerCase())
    );

    const visibleCount = 4;
    const restCount = visibleMedia.length - visibleCount;
    const displayMedia = visibleMedia.slice(0, visibleCount);

    const isSingle = displayMedia.length === 1;
    const lastFile = displayMedia[displayMedia.length - 1]; // last image/video

    return (
      <>
        <div className={`${isSingle ? "grid-cols-1" : "grid-cols-2"}  grid gap-2`}>
          {displayMedia.map((file, index) => {
            const fileType = file.text.split(".").pop().toLowerCase();
            const isLastVisible = index === visibleCount - 1 && restCount > 0;

            let content;
            if (["jpg", "jpeg", "png", "gif"].includes(fileType)) {
              content = (
                <img
                  src={`${backendbaseurl}/images/${file.text}`}
                  alt="media"
                  className="w-[600px] h-[250px] object-cover rounded-md z-20"
                />
              );
            } else if (["mp4", "avi", "mov"].includes(fileType)) {
              content = (
                <video className="w-full object-cover rounded-md" muted>
                  <source src={`${backendbaseurl}/videos/${file.text}`} type={`video/${fileType}`} />
                </video>
              );
            } else {
              return null;
            }

            return (
              <div
                key={file._id || index}
                className={`relative cursor-pointer 
                  ${displayMedia.length === 3 && index === 0 ? "col-span-2" : ""}`}
                onClick={() => openMediaViewer(media, sender, msgid)}
              >
                {content}


                {/* +N Overlay */}
                {isLastVisible && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-md">
                    <span className="text-white text-xl font-bold">+{restCount}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Show time below grid once */}
        {lastFile && (
          <div className={`text-[10px] ${loginuser !== sender._id ? 'text-black' : 'text-white'} text-right pr-1 -mt-1`}>
            {format(lastFile.createdAt)}
          </div>
        )}
      </>
    );
  };


  const renderOtherMedia = () => {
    return media.map((file, index) => {
      const fileType = file.text.split(".").pop().toLowerCase();
      const baseUrl = fileType.match(/(mp3|webm|ogg)/) ? 'audio' : 'documents';
      const url = `${backendbaseurl}/${baseUrl}/${file.text}`;

      if (["mp3", "webm", "ogg"].includes(fileType)) {
        return (
          <div key={index} className="inline-block m-2">
            <audio controls className="w-full sm:max-w-xs md:max-w-sm lg:max-w-md">
              <source src={url} type={`audio/${fileType}`} />
              Your browser does not support the audio element.
            </audio>
            {index === media.length - 1 && (
              <span className="ml-36 text-[7px]">{format(file.createdAt)}</span>
            )}
          </div>
        );
      }

      if (["pdf", "doc", "docx"].includes(fileType)) {
        return (
          <div key={index} className="m-2 w-full sm:w-auto">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block break-all whitespace-normal ${sender._id === loginuser ? 'text-white' : 'text-black'} underline mb-1`}
            >
              {file.text}
            </a>
            {index === media.length - 1 && (
              <span className="ml-5 text-[7px]">{format(file.createdAt)}</span>
            )}
          </div>
        );
      }

      return null;
    });
  };

  return (
    <div className="flex flex-col gap-1">
      {renderMediaGrid()}
      {renderOtherMedia()}
    </div>
  );
};

export default Mediamessage;
