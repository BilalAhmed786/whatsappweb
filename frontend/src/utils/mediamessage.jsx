import React from "react";
import axios from "axios";
import { format } from "timeago.js";
import { backendbaseurl } from "../baseurl/baseurl";

const Mediamessage = ({ media, msgid, sender, openMediaViewer, loginuser }) => {
  // Helper function to extract file extension from Cloudinary URL or path
  const getFileType = (url = "") => {
    const cleanUrl = url.split("?")[0];
    return cleanUrl.split(".").pop().toLowerCase();
  };

  // Helper function to extract filename from URL for display
  const getFileName = (url = "") => {
    const filename = url.split("/").pop();
    return decodeURIComponent(filename).replace(/^\d+-/, "");
  };

  // Secure Axios Document Download with Credentials
  const handleDocumentDownload = async (fileUrl, fileName) => {
    try {
      const response = await axios({
        url: `${backendbaseurl}/api/files/download`,
        method: "GET",
        params: {
          url: fileUrl,
          filename: fileName,
        },
        withCredentials: true, // MUST BE TRUE to attach cookies to userAuthorize middleware
        responseType: "blob", // Received as binary data stream
      });

      // Create a temporary downloadable link for the blob
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup DOM
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Document download failed:", error);
      alert("Failed to download document. Please try again.");
    }
  };

  const renderMediaGrid = () => {
    const visibleMedia = media.filter((file) =>
      ["jpg", "jpeg", "png", "gif", "mp4", "avi", "mov"].includes(
        getFileType(file.text)
      )
    );

    const visibleCount = 4;
    const restCount = visibleMedia.length - visibleCount;
    const displayMedia = visibleMedia.slice(0, visibleCount);

    const isSingle = displayMedia.length === 1;
    const lastFile = displayMedia[displayMedia.length - 1];

    if (displayMedia.length === 0) return null;

    return (
      <>
        <div
          className={`${isSingle ? "grid-cols-1" : "grid-cols-2"} grid gap-2`}
        >
          {displayMedia.map((file, index) => {
            const fileType = getFileType(file.text);
            const isLastVisible = index === visibleCount - 1 && restCount > 0;

            let content;
            if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileType)) {
              content = (
                <img
                  src={file.text}
                  alt="media"
                  className="w-[600px] h-[250px] object-cover rounded-md z-20"
                />
              );
            } else if (["mp4", "avi", "mov"].includes(fileType)) {
              content = (
                <video
                  className="w-full object-cover rounded-md"
                  muted
                  controls={false}
                >
                  <source
                    src={file.text}
                    type={`video/${fileType === "mov" ? "mp4" : fileType}`}
                  />
                </video>
              );
            } else {
              return null;
            }

            return (
              <div
                key={file._id || index}
                className={`relative cursor-pointer ${
                  displayMedia.length === 3 && index === 0 ? "col-span-2" : ""
                }`}
                onClick={() => openMediaViewer(media, sender, msgid)}
              >
                {content}

                {isLastVisible && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center rounded-md">
                    <span className="text-white text-xl font-bold">
                      +{restCount}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {lastFile && (
          <div
            className={`text-[10px] ${
              loginuser !== sender._id ? "text-slate-300" : "text-slate-200"
            } text-right pr-1 -mt-1`}
          >
            {format(lastFile.createdAt)}
          </div>
        )}
      </>
    );
  };

  const renderOtherMedia = () => {
    return media.map((file, index) => {
      const fileType = getFileType(file.text);
      const fileUrl = file.text;

      if (["mp3", "webm", "ogg", "wav", "m4a"].includes(fileType)) {
        return (
          <div key={index} className="inline-block m-2">
            <audio
              controls
              className="w-full sm:max-w-xs md:max-w-sm lg:max-w-md"
            >
              <source src={fileUrl} type={`audio/${fileType}`} />
              Your browser does not support the audio element.
            </audio>
            {index === media.length - 1 && (
              <span className="ml-36 text-[7px] text-slate-400">
                {format(file.createdAt)}
              </span>
            )}
          </div>
        );
      }

      if (["pdf", "doc", "docx", "txt", "zip"].includes(fileType)) {
        const fileName = getFileName(fileUrl);

        return (
          <div key={index} className="m-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleDocumentDownload(fileUrl, fileName)}
              className={`block text-left break-all whitespace-normal ${
                sender._id === loginuser
                  ? "text-black hover:text-indigo-400"
                  : "text-slate-200 hover:text-indigo-400"
              } underline mb-1 cursor-pointer`}
            >
              📄 {fileName}
            </button>
            {index === media.length - 1 && (
              <span className="ml-5 text-[7px] text-slate-400">
                {format(file.createdAt)}
              </span>
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