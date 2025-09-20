import React from 'react';
import { backendbaseurl } from '../baseurl/baseurl';

const replyindividualmedia = ({ filename }) => {

  const fileType = filename.split('.').pop().toLowerCase();
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  const videoExtensions = ['mp4', 'webm', 'avi', 'mov'];
  const audioExtensions = ['mp3', 'wav', 'ogg'];

  if (imageExtensions.includes(fileType)) {
    return <img src={`${backendbaseurl}/images/${filename}`} alt="Image" className="max-w-full max-h-40" />;
  }

  if (videoExtensions.includes(fileType)) {
    return (
      <video controls className="max-w-full max-h-40">
        <source src={`${backendbaseurl}/videos/${filename}`} type={`video/${fileType}`} />
        Your browser does not support the video tag.
      </video>
    );
  }

  if (audioExtensions.includes(fileType)) {
    return (
      <audio controls className="w-full">
        <source src={`${backendbaseurl}/audio/${filename}`} type={`audio/${fileType}`} />
        Your browser does not support the audio element.
      </audio>
    );
  }

  // Default case for unsupported file types
  return <p>Unsupported media type: {filename}</p>;
};

export default replyindividualmedia;
