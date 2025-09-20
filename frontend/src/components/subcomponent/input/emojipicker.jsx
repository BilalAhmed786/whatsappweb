import React, { useEffect, useRef, useState } from 'react'
import EmojiPicker from 'emoji-picker-react';
import { FaSmile } from 'react-icons/fa';


const emojipicker = ({setMessage}) => {
 const [showEmojiPicker, setShowEmojiPicker] = useState(false);
 const emojiPickerRef = useRef(null);
 
 
 
 const toggleEmojiPicker = () => {
   
    setShowEmojiPicker(!showEmojiPicker);
  };

 const onEmojiClick = (event, emojiObject) => {
    setMessage((prev) => prev + event.emoji);
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
     

      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



    return (
        <div className="flex items-center text-xl cursor-pointer text-blue-800">
            <FaSmile onClick={toggleEmojiPicker} />
            {showEmojiPicker && (
                <div className='relative'>
                    <div className="absolute z-50 bottom-10" ref={emojiPickerRef}>
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default emojipicker