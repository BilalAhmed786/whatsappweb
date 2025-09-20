import { useRef } from "react";
import { FaMicrophone,FaPaperPlane,FaStop} from "react-icons/fa";
const audiorecorder = (
    {
        setIsRecording,
        setRecording,
        setRecordingTime,
        recordingTime,
        handleSend,
        mediaRecorderRef,
        isRecording,
        recording,
        images,
        documents,
        videos,
        forwardmsgid,
        audioChunksRef
    }) => {
    const intervalRef = useRef(null);

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
                mediaRecorderRef.current = mediaRecorder;

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data); // Push chunk into audioChunksRef
                    }
                };

                mediaRecorder.onstop = () => {
                    if (audioChunksRef.current.length > 0) {
                        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                        const uniqueFileName = `audio_${Date.now()}.webm`; // Generate a unique name
                        const recordingFile = new File([audioBlob], uniqueFileName, { type: 'audio/webm' });
                        setRecording(recordingFile); // Set recording state
                        audioChunksRef.current = []; // Reset chunks array after processing
                    }
                };

                mediaRecorder.start();
                setIsRecording(true); // Set recording state to true

                // Start the timer
                intervalRef.current = setInterval(() => {
                    setRecordingTime((prevTime) => prevTime + 1);
                }, 1000);
            })
            .catch(error => {
                console.error('Error accessing microphone:', error);
            });
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();  // Stop the recording
            setIsRecording(false); // Reset recording state

            // Clear the timer interval
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const formatRecordingTime = () => {
        const minutes = Math.floor(recordingTime / 60);
        const seconds = recordingTime % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };




    return (
        <div className="mx-3 text-2xl cursor-pointer text-blue-800">
            <div className='w-12 flex'>
                {isRecording ? (
                    <div className='flex items-center gap-4 justify-center'>
                        <div className="rounded-full border border-red-600 p-1">
                            <FaStop className="text-red-600 text-xs cursor-pointer" onClick={stopRecording} />
                        </div>
                        <span className="flex items-center text-lg h-20 text-red-600">
                            {formatRecordingTime()}
                        </span>
                    </div>
                ) : (
                    !recording &&
                    !isRecording &&
                    images.length === 0 &&
                    documents.length === 0 &&
                    videos.length === 0 &&
                    forwardmsgid.length === 0 &&
                    <div className='flex gap-1'>
                        <div>
                            <FaMicrophone onClick={startRecording} />
                        </div>
                        <div>
                            <button onClick={handleSend}>
                                <FaPaperPlane />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default audiorecorder