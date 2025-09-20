import { useState, useRef, useEffect, useContext } from 'react';
import ReplyMessage from './subcomponent/input/replymessage';
import { UserContext } from '../contextapi/contextapi';

import axios from 'axios';
import { backendbaseurl } from '../baseurl/baseurl';
import Dropdown from './subcomponent/input/dropdown';
import Emojipicker from './subcomponent/input/emojipicker';
import Frwdmsgcount from './subcomponent/input/frwdmsgcount';
import Textarea from './subcomponent/input/textarea';
import Audiorecorder from './subcomponent/input/audiorecorder';
import Previewmedia from './subcomponent/input/previewmedia';

const Input = ({
  textareaRef,
  setReplymessage,
  replymessage,
  forwardmsgid,
  setForwardmsgid,
  setDisplayusers,
  setCheckbox,
  checkbox,
  setmsgnlastmsg,
  userExists,
  initialLoad,
  setShowBlockNotification
 
}) => {


  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [videos, setVideos] = useState([]);  // State for video files
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);  // New state for the timer
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]); 
 

  const { socket, data, chatuserinfo } = useContext(UserContext)




const handleSend = async (e) => {
    e.preventDefault();

    const blockeduser = data.blockedUsers.some((user) => user.userId === chatuserinfo.userId)

    if (blockeduser) {

      setShowBlockNotification({ reaction: 'message' });

      return;
    }

    if (message.trim() || images.length || documents.length || videos.length || recording) {
      const formData = new FormData(); // Correctly initialize FormData

      // Append message if it exists
      if (message.trim()) {
        formData.append('message', message.trim());
      }

      // Append images
      images.forEach(image => {
        formData.append('images', image); // Use 'images' as the key
      });

      // Append documents
      documents.forEach(doc => {
        formData.append('documents', doc); // Use 'documents' as the key
      });

      // Append videos
      videos.forEach(video => {
        formData.append('videos', video); // Use 'videos' as the key
      });

      // Append recording if it exists
      if (recording) {
        formData.append('recording', recording); // Use 'recording' as the key
      }

      // Add sender and receiver IDs
      formData.append('senderid', data._id);
      formData.append('receiverid', chatuserinfo.userId);
      formData.append('isviewed', userExists && chatuserinfo.status === 1 ? true : false)
      if (replymessage.repliedtomsgId) {

        formData.append('replyid', replymessage.repliedtomsgId);

      }
      if (replymessage.objectId) {

        formData.append('objectid', replymessage.objectId && replymessage.objectId);

      }

      try {
        const response = await axios.post(`${backendbaseurl}/api/files/uploads`, formData, { withCredentials: true });

        if (response.data) {

          socket?.emit('latestmsg', { lastmsg: response.data, receiverid: chatuserinfo.userId })

          //for scroll to bottom
           initialLoad.current = true
         
        }


        // Reset after sending
        setMessage('');
        setmsgnlastmsg(Date.now())
        setImages([]);
        setDocuments([]);
        setReplymessage('');
        setVideos([]);
        setRecording(null);
        setRecordingTime(0); // Reset the timer


        textareaRef.current.style.height = 'auto';

      } catch (error) {
        console.error('Error uploading files:', error); // Handle error
      }


    }
  };


  // Handle click outside for dropdown and emoji picker


  return (

    <div>
     <div className="w-full">
        <div className="relative w-full flex justify-between items-center">
          {!isRecording && !recording &&
            images.length === 0 &&
            documents.length === 0 &&
            videos.length === 0 &&
            forwardmsgid.length === 0 &&
            <>

              <Dropdown
                setImages={setImages}
                images={images}
                setVideos={setVideos}
                videos={videos}
                setDocuments={setDocuments}
                documents={documents}
              />

              <Emojipicker
                setMessage={setMessage}

              />

            </>
          }

          <div className="flex items-center w-11/12 bg-gray-100 rounded-lg shadow-md">


            <ReplyMessage

              setReplymessage={setReplymessage}
              replymessage={replymessage}
              initialLoad={initialLoad}
              

            />

            <Frwdmsgcount
              setCheckbox={setCheckbox}
              checkbox={checkbox}
              setForwardmsgid={setForwardmsgid}
              forwardmsgid={forwardmsgid}
              setDisplayusers={setDisplayusers}

            />

            <Textarea
              isRecording={isRecording}
              recording={recording}
              images={images}
              documents={documents}
              videos={videos}
              forwardmsgid={forwardmsgid}
              textareaRef={textareaRef}
              message={message}
              setMessage={setMessage}
              handleSend={handleSend}
            />


            <Audiorecorder
              setIsRecording={setIsRecording}
              setRecordingTime={setRecordingTime}
              recordingTime={recordingTime}
              setRecording={setRecording}
              handleSend={handleSend}
              mediaRecorderRef={mediaRecorderRef}
              isRecording={isRecording}
              recording={recording}
              images={images}
              documents={documents}
              videos={videos}
              forwardmsgid={forwardmsgid}
              audioChunksRef={audioChunksRef}
            />
          </div>

        </div>

       {/* preview media  */}

          <Previewmedia 

            images={images}
            documents={documents}
            videos={videos}
            recording={recording}
            handleSend={handleSend}
            setRecording={setRecording}
            setRecordingTime={setRecordingTime}
            setImages={setImages}
            setVideos={setVideos}
            setDocuments={setDocuments}
            mediaRecorderRef={mediaRecorderRef}
            audioChunksRef={audioChunksRef}

            
          
          
          />


      </div>
            
     


    </div>
  );
};

export default Input;
