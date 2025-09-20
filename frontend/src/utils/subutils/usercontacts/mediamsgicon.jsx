import { FaFile, FaVideo, FaImage, FaMicrophone } from "react-icons/fa";

const mediaMsgicon = (media) => {
  if (!media || media.length === 0) return null;

  // Check if it's a string or an object with a 'text' property
  const fileType = media[0].text ? media[0].text.split(".").pop().toLowerCase() : media[0].split(".").pop().toLowerCase();

  // Determine the icon to display based on the file type
  if (["jpg", "jpeg", "png", "gif"].includes(fileType)) {
    return (
      <div className="m-1">
        <FaImage />
      </div>
    );
  }

  if (["mp4", "avi", "mov"].includes(fileType)) {
    return (
      <div className="m-1">
        <FaVideo />
      </div>
    );
  }

  if (["mp3", "webm", "ogg"].includes(fileType)) {
    return (
      <div className='m-1'>
        <FaMicrophone />
      </div>
    );
  }

  if (["pdf", "doc", "docx"].includes(fileType)) {
    return (
      <div className= 'm-1'>
        <FaFile />
      </div>
    );
  }

  return null;  // Default to null if no valid file type is found
};


export default mediaMsgicon;
