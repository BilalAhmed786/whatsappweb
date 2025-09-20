import { useContext, useEffect, useRef, useState } from 'react';
import Header from '../components/header';
import Messages from '../components/messages';
import Users from '../components/users';
import Input from '../components/input';
import Showindmsg from '../components/showindmsg';
import Userprofile from '../components/userprofile';
import Myprofile from '../components/myprofile';
import MediaViewer from "../utils/mediaviewer";
import { UserContext } from '../contextapi/contextapi';
import SaifTech from '../components/saiftech';
import background from '../images/background.jpg'
import axios from 'axios';
import { backendbaseurl } from '../baseurl/baseurl';


const Home = () => {

    const [searchindmsg, setIndmsg] = useState(1);
    const [search, stateSearch] = useState('')
    const [searchmsgid,setSearchmsgid] = useState(null)
    const [highlightedId, setHighlightedId] = useState(null);
    const [myprofile, setMyprofile] = useState(true);
    const [messages, setChatMessage] = useState([]);
    const [showBlockNotification, setShowBlockNotification] = useState(false);
    const [checkbox, setCheckbox] = useState(false)
    const [deltecheckbox, setdeleteCheckbox] = useState(false)
    const [chater, setChater] = useState([])
    const [replymessage, setReplymessage] = useState('');
    const [forwardmsgid, setForwardmsgid] = useState([]);
    const [forwardmsgobjid, setForwardmsgobjid] = useState('');
    const [displayusers, setDisplayusers] = useState(false)
    const [deletemsgs, setDeletemsgs] = useState(false)
    const [chatclear, setChatclear] = useState(false)
    const [selectedMedia, setSelectedMedia] = useState([]);
    const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
    const [updatemsgs, setUpdatemsgs] = useState('')
    const [msgnlastmsg, setmsgnlastmsg] = useState('')
    const [mediamsgupdate, setMeidamsgupdate] = useState('')
    const textareaRef = useRef(null);
    const messageRefs = useRef({});
    const chatContainerRef = useRef(null);
    const initialLoad = useRef(true);
    const [showUserList, setShowUserList] = useState(false);



    const { socket, data, chatuserinfo, setChatuserinfo, fetchUserInfo } = useContext(UserContext)

    const userExists = chater.some(

        (user) =>
            user.chatuser?.toString() === data?._id?.toString() &&
            user.loginuser?.toString() === chatuserinfo.userId?.toString()
    );


    // Function to scroll to a specific message by ID
    const scrollToMessage = (messageId) => {

        const messageElement = messageRefs.current[messageId];

        if (messageElement) {


            messageElement.scrollIntoView({ behavior: "auto", block: "center" });

            if(searchmsgid){

                setHighlightedId(messageId);
            
            }

               // remove highlight after 2 seconds
             setTimeout(() => setHighlightedId(null),300);
        }
    };

    //scroll at bottom on chat
    const scrollToBottom = () => {
        if (chatContainerRef.current) {

            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;

        }

    }


useEffect(() => {
  if (!messages.length) return;

  // Only scroll to bottom on first load
  if (initialLoad.current) {
    requestAnimationFrame(() => {
     
      scrollToBottom();
     
    });
    initialLoad.current = false; 
  }
}, [messages.length]);
 // watch only the last message

   useEffect(() => {

        const notificationdata = async () => {

            try {

                const res = await axios.get(`${backendbaseurl}/api/notification/allnotification`, { withCredentials: true })

                setChater(res.data)

            } catch (error) {

                console.log(error)
            }


        }

        notificationdata()


    }, [])



    // login userinfo
    useEffect(() => {
        if(!socket) return 

        socket.connect()

        const userInfo = async () => {

            await fetchUserInfo();
        }


        userInfo()


        return ()=>{
            socket.disconnect()  //on this component unmout socket will disconnect
        }

    }, [socket,data?._id])


    const openMediaViewer = (mediaFiles, sender, msgId) => {

        setSelectedMedia({ mediaFiles, sender, msgId });
        setIsMediaViewerOpen(true);
    };

    const closeMediaViewer = () => {
        setIsMediaViewerOpen(false);
        setSelectedMedia([]);
    };

 
    //background for messages component
    const Messagesbackground = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
    };



    useEffect(() => {

        if (!socket) return;

        const handlechatuser = (data) => {
            setChater((prev) => {
                const userexist = prev.some(user => user.loginuser === data.loginuser);

                if (userexist) {
                    return prev.map((user) =>
                        user.loginuser === data.loginuser
                            ? { ...user, chatuser: data.chatuser } // Correctly update the user
                            : user
                    );
                } else {
                    return [...prev, { loginuser: data.loginuser, chatuser: data.chatuser }];
                }
            });
        };



        socket?.on('chatuser', handlechatuser);

        return () => {

            socket?.off('chatuser', handlechatuser);
        };
    }, [socket]);






    return (
        <div className='flex w-full h-full overflow-hidden'>
            {myprofile ?
                <div className={`lg:flex-[1] lg:relative lg:translate-x-0 w-full bg-white z-20 transition-transform duration-300 ease-in-out
                 ${showUserList ? 'translate-x-0 absolute inset-0' : '-translate-x-full'} `}>
                    <Users
                        setMyprofile={setMyprofile}
                        initialLoad={initialLoad}
                        setIndmsg={setIndmsg}
                        setCheckbox={setCheckbox}
                        setForwardmsgid={setForwardmsgid}
                        msgnlastmsg={msgnlastmsg}
                        updatemsgs={updatemsgs}
                        setReplymessage={setReplymessage}
                        messageRefs={messageRefs}
                        setShowUserList={setShowUserList}
                        setSearchmsgid={setSearchmsgid}
                        scrollToMessage={scrollToMessage}
                    />
                </div>
                :

                <div className={`lg:flex-[1] lg:relative lg:translate-x-0 w-full bg-white z-20 transition-transform duration-300 ease-in-out
                 ${showUserList ? 'translate-x-0 absolute inset-0' : '-translate-x-full'} `}>
                    <Myprofile setMyprofile={setMyprofile} socket={socket} />
                </div>
            }
            {/* Main Content Area with slide-in effect */}
            {chatuserinfo ?

                <div
                    className={`lg:flex-[2] lg:relative lg:translate-x-0 w-full overflow-hidden bg-white  transition-transform duration-300 ease-in-out
                       ${!showUserList ? 'absolute translate-x-0 inset-0 min-h-screen' : '-translate-x-full'} 
                         `}
                >

                    {searchindmsg === 1 && chatuserinfo &&
                        <div
                            className={`absolute inset-0 transform transition-transform duration-700 ease-in-out overflow-hidden
                                 ${searchindmsg === 1 ? 'translate-x-0' : 'translate-x-full'} 
                                 ${searchindmsg !== 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        >
                            {/* Full-height flex container */}
                            <div className="flex flex-col h-full">

                                {/* Header with fixed height */}
                                <div className='h-20 lg:h-14 md:h-28 min-h-[10vh] shrink-0'>
                                    <Header
                                        searchindmsg={searchindmsg}
                                        stateSearch={stateSearch}
                                        setIndmsg={setIndmsg}
                                        setDeletemsgs={setDeletemsgs}
                                        setdeleteCheckbox={setdeleteCheckbox}
                                        setChatclear={setChatclear}
                                        setCheckbox={setCheckbox}
                                        setForwardmsgid={setForwardmsgid}
                                        setReplymessage={setReplymessage}
                                        setShowUserList={setShowUserList}
                                        socket={socket}
                                    />
                                </div>

                                {/* Main content area (Messages + Input) */}
                                <div className="flex flex-col flex-1 min-h-0">

                                    {/* Messages scrollable area */}
                                    <div
                                        className="flex-1 overflow-y-auto overflow-x-hidden px-5 custom-scrollbar"
                                        ref={chatContainerRef}
                                        style={Messagesbackground}
                                    >
                                        <Messages
                                            setReplymessage={setReplymessage}
                                            setChatMessage={setChatMessage}
                                            messages={messages}
                                            textareaRef={textareaRef}
                                            setForwardmsgid={setForwardmsgid}
                                            forwardmsgid={forwardmsgid}
                                            checkbox={checkbox}
                                            setCheckbox={setCheckbox}
                                            displayusers={displayusers}
                                            setDisplayusers={setDisplayusers}
                                            openMediaViewer={openMediaViewer}
                                            forwardmsgobjid={forwardmsgobjid}
                                            messageRefs={messageRefs}
                                            deletemsgs={deletemsgs}
                                            setDeletemsgs={setDeletemsgs}
                                            deltecheckbox={deltecheckbox}
                                            setdeleteCheckbox={setdeleteCheckbox}
                                            setChatclear={setChatclear}
                                            chatclear={chatclear}
                                            setMeidamsgupdate={setMeidamsgupdate}
                                            setUpdatemsgs={setUpdatemsgs}
                                            updatemsgs={updatemsgs}
                                            msgnlastmsg={msgnlastmsg}
                                            userExists={userExists}
                                            chater={chater}
                                            setShowBlockNotification={setShowBlockNotification}
                                            showBlockNotification={showBlockNotification}
                                            scrollToMessage={scrollToMessage}
                                            chatContainerRef={chatContainerRef}
                                            searchmsgid={searchmsgid}
                                            setSearchmsgid={setSearchmsgid}
                                            highlightedId={highlightedId}
                                            setHighlightedId={setHighlightedId}
                                            initialLoad={initialLoad}
                                        />
                                    </div>

                                    {/* Input with dynamic height */}
                                    <div className="shrink-0">
                                        <Input
                                            textareaRef={textareaRef}
                                            replymessage={replymessage}
                                            setReplymessage={setReplymessage}
                                            setForwardmsgid={setForwardmsgid}
                                            forwardmsgid={forwardmsgid}
                                            setCheckbox={setCheckbox}
                                            checkbox={checkbox}
                                            setDisplayusers={setDisplayusers}
                                            setmsgnlastmsg={setmsgnlastmsg}
                                            userExists={userExists}
                                            initialLoad={initialLoad}
                                            setShowBlockNotification={setShowBlockNotification}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    <div
                        className={`absolute inset-0 transform transition-transform duration-700 ease-in-out 
                    ${searchindmsg === 2 ? 'translate-x-0' : 'translate-x-full'} 
                    ${searchindmsg !== 2 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        <Showindmsg
                            setIndmsg={setIndmsg}
                            stateSearch={stateSearch}
                            setSearchmsgid={setSearchmsgid}
                            search = {search}
                            chatuserinfo={chatuserinfo}
                            loginuser={data?._id}
                            scrollToMessage={scrollToMessage}
                            deletemsgs={deletemsgs}
                            setDeletemsgs={setDeletemsgs}
                            setChatuserinfo={setChatuserinfo}
                            data={data}
                        />
                    </div>

                    {/* Userprofile view */}
                    <div
                        className={`absolute inset-0 transform transition-transform duration-700 ease-in-out
                    ${searchindmsg === 3 ? 'translate-x-0' : 'translate-x-full'} 
                    ${searchindmsg !== 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        <Userprofile
                            setIndmsg={setIndmsg}
                            openMediaViewer={openMediaViewer}
                            mediamsgupdate={mediamsgupdate}
                            updatemsgs={updatemsgs}
                        />
                    </div>
                </div>

                :
                <div
                    className={`lg:flex-[2] lg:relative lg:translate-x-0 w-full bg-white  transition-transform duration-300 ease-in-out
                     ${!showUserList ? 'translate-x-0 absolute inset-0' : '-translate-x-full'}`}
                >
                    <SaifTech setShowUserList={setShowUserList} />
                </div>
            }


            {isMediaViewerOpen && (
                <MediaViewer
                    mediaFiles={selectedMedia}
                    setReplymessage={setReplymessage}
                    textareaRef={textareaRef}
                    replymessage={replymessage}
                    onClose={closeMediaViewer}
                    setDisplayusers={setDisplayusers}
                    setForwardmsgid={setForwardmsgid}
                    setForwardmsgobjid={setForwardmsgobjid}
                    setUpdatemsgs={setUpdatemsgs}
                    userExists={userExists}
                    setShowBlockNotification={setShowBlockNotification}
                />
            )}

        </div>
    );
};

export default Home; 