import React, { useEffect, useRef, useState } from 'react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { FaSmile } from 'react-icons/fa';

const Emojipicker = ({ setMessage }) => {
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
    <div className="flex items-center text-xl cursor-pointer text-slate-400 hover:text-slate-200 transition-colors">
      <FaSmile onClick={toggleEmojiPicker} />
      {showEmojiPicker && (
        <div className="relative">
          <div className="absolute z-50 bottom-10" ref={emojiPickerRef}>
            <EmojiPicker onEmojiClick={onEmojiClick} theme={Theme.DARK} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Emojipicker;