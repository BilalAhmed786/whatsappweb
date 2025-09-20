
const textarea = (
    {
        isRecording,
        recording,
        images,
        documents,
        videos,
        forwardmsgid,
        textareaRef,
        setMessage,
        message,
        handleSend

    }) => {


    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent newline character
            handleSend(e); // Trigger send
        }
    };


    const handleInputChange = (e) => {
        setMessage(e.target.value);
        textareaRef.current.style.height = 'auto';
        const newHeight = `${textareaRef.current.scrollHeight}px`;
        textareaRef.current.style.height = newHeight;
    };



    return (
        <>
            {!isRecording &&
                !recording &&
                images.length === 0 &&
                documents.length === 0 &&
                videos.length === 0 &&
                forwardmsgid.length === 0 &&
                <textarea
                    ref={textareaRef}
                    className="flex-grow justify-center pt-5 pl-5 bg-transparent border-none outline-none h-auto max-h-40 resize-none overflow-y-auto text-lg"
                    placeholder="Write something..."
                    value={message}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                ></textarea>

            }


        </>
    )
}

export default textarea