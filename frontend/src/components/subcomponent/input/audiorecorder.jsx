import { useRef } from "react";
import { FaMicrophone, FaPaperPlane, FaStop } from "react-icons/fa";

const Audiorecorder = ({
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
  audioChunksRef,
}) => {
  const intervalRef = useRef(null);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
        });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, {
              type: "audio/webm",
            });
            const uniqueFileName = `audio_${Date.now()}.webm`;
            const recordingFile = new File([audioBlob], uniqueFileName, {
              type: "audio/webm",
            });
            setRecording(recordingFile);
            audioChunksRef.current = [];
          }
        };

        mediaRecorder.start();
        setIsRecording(true);

        intervalRef.current = setInterval(() => {
          setRecordingTime((prevTime) => prevTime + 1);
        }, 1000);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const formatRecordingTime = () => {
    const minutes = Math.floor(recordingTime / 60);
    const seconds = recordingTime % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="text-2xl">
      <div className="flex items-center">
        {isRecording ? (
          <div className="flex items-center">
            {/* Pulse Animation Indicator */}
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <div className="relative rounded-full bg-rose-500/20 border border-rose-500/50 p-2 text-rose-500 hover:bg-rose-500/30 transition-all cursor-pointer">
                <FaStop className="text-xs" onClick={stopRecording} />
              </div>
            </div>

            {/* Live Timer Badge */}
            <span className="font-mono text-sm tracking-wider font-semibold text-rose-400 bg-rose-950/40 border border-rose-800/40 px-2.5 py-1 rounded-md shadow-sm">
              {formatRecordingTime()}
            </span>
          </div>
        ) : (
          !recording &&
          !isRecording &&
          images.length === 0 &&
          documents.length === 0 &&
          videos.length === 0 &&
          forwardmsgid.length === 0 && (
            <div className="flex items-center">
              {/* Mic Icon */}
              <button
                type="button"
                onClick={startRecording}
                className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 rounded-full transition-all duration-200"
                aria-label="Start Recording"
              >
                <FaMicrophone className="text-xl" />
              </button>

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSend}
                className="p-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_12px_rgba(34,211,238,0.3)] hover:shadow-[0_0_18px_rgba(34,211,238,0.5)] transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center"
                aria-label="Send Message"
              >
                <FaPaperPlane className="text-sm -translate-x-0.5" />
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Audiorecorder;