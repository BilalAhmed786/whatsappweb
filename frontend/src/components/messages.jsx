import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { UserContext } from "../contextapi/contextapi";
import Mediamessage from "../utils/mediamessage";
import Forwardmsgs from "./forwardmsgs";
import Deletemsgs from "../utils/deletemsgs";
import Clearchat from "../utils/clearchat";
import { backendbaseurl } from "../baseurl/baseurl";
import Checkbox from "./subcomponent/messages/checkbox";
import Textmsg from "./subcomponent/messages/textmsg";
import Msgdelivercheck from "./subcomponent/messages/msgdelivercheck";
import Reaction from "./subcomponent/messages/reaction";
import Tooltip from "./subcomponent/messages/tooltip";
import Buttons from "./subcomponent/messages/buttons";
import Dropdown from "./subcomponent/messages/dropdown";
import Filtermediafile from "./subcomponent/messages/filtermediafile";
import {userealtimemsgs} from "./subcomponent/messages/userealtimemsgs";
import {searchscroller}  from "./subcomponent/messages/searchscroller";
import Blocknotific from "../utils/blocknotific";
import Mediareactions from "./subcomponent/messages/mediareactions";
import { BsEmojiSmileFill } from "react-icons/bs";


const Messages = ({

  setReplymessage,
  setChatMessage,
  searchmsgid,
  highlightedId,
  setSearchmsgid,
  messages,
  chatContainerRef,
  textareaRef,
  setForwardmsgid,
  forwardmsgobjid,
  forwardmsgid,
  setCheckbox,
  setDisplayusers,
  displayusers,
  setDeletemsgs,
  setChatclear,
  chatclear,
  scrollToMessage,
  deltecheckbox,
  setdeleteCheckbox,
  checkbox,
  openMediaViewer,
  messageRefs,
  setUpdatemsgs,
  setShowBlockNotification,
  showBlockNotification,
  updatemsgs,
  msgnlastmsg,
  userExists,
  chater,
  initialLoad



}) => {

  const { data, socket, chatuserinfo } = useContext(UserContext);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [dropdown, setDropdown] = useState({});
  const [msgid, setMsgid] = useState('')
  const [emojihoverid, setEmojihover] = useState('')
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const emojiPickerRef = useRef(null); // Ref for EmojiPicker
  const messagedropdown = useRef(null);
  const pageRef = useRef(1);
  const messagesids = messages[0]?.messages?.map((msg) => msg._id) 
console.log(messages)
  const fetchChatMessages = async (pageToLoad = 1) => { //pagination for message

    if (isLoading || searchmsgid ) return;
    setIsLoading(true);

    const div = chatContainerRef.current;
    const prevScrollHeight = div.scrollHeight;
    const prevScrollTop = div.scrollTop;

    try {
      const result = await axios.get(
        `${backendbaseurl}/api/chat/oneonone/${data._id}/${chatuserinfo.userId}?page=${pageToLoad}&limit=50`,
        { withCredentials: true }
      );

      if (result.data.length === 0) {
        setHasMore(false);
      } else {
        if (pageToLoad === 1) {
          setChatMessage(result.data);
        } else {
          setChatMessage(prev => [...result.data, ...prev]);

          requestAnimationFrame(() => {
            const newScrollHeight = div.scrollHeight;
            const heightDiff = newScrollHeight - prevScrollHeight;
            div.scrollTop = heightDiff;
          });

        }
        pageRef.current = pageToLoad; // update only if new data arrived
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //searchmessage


 useEffect(() => {
    const div = chatContainerRef.current;
    if (!div) return;

    const handleScroll = () => {
      if (!hasMore || isLoading) return;

      if (div.scrollTop <= 300) {

        setIsLoading(true);

        const nextPage = pageRef.current + 1;
        fetchChatMessages(nextPage);
      }
    };


    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading,searchmsgid]);



useEffect(() => {

  if (data._id) { 
    setHasMore(true);
    pageRef.current = 1;
    fetchChatMessages(1);
  }
}, [chatuserinfo, data._id, msgnlastmsg]);



useEffect(() => {
  if (!searchmsgid) return;

  setChatMessage([])
  searchscroller(searchmsgid, chatuserinfo.userId, setChatMessage,chatContainerRef)
    .then((id) => {
      if (!id) return;
      setTimeout(() => {
           scrollToMessage(id);
           setSearchmsgid(null);
           setIsLoading(false)
        
      }, 1000);
       
     });
}, [searchmsgid, chatuserinfo,updatemsgs]);




  const addReaction = async (messageId, textmsg, emoji, chatuserid, isviewed) => {

    const userid = data._id

    const result = await axios.post(`${backendbaseurl}/api/chat/reaction`, { messageId, emoji, userid, textmsg, chatuserid, isviewed }, { withCredentials: true })
    try {

      
      socket?.emit('messagereaction', result.data)
      // setUpdatemsgs(Date.now())
      initialLoad.current = false



    } catch (error) {

      console.log(error)
    }

  };

  //undo reaction
  const emojireactuser = (id) => {

    setEmojihover(id)
  }

  const handleClickOutside = (event) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target)
    ) {
      setSelectedMessage(null);
    }

    if (
      messagedropdown.current &&
      !messagedropdown.current.contains(event.target)
    ) {
      // Close all dropdowns by setting an empty object
      setDropdown({});
    }

    // setCheckbox(false)

  };


  useEffect(() => {
    if (selectedMessage !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedMessage]);


  useEffect(() => {
    if (Object.keys(dropdown).length > 0) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdown]);



  userealtimemsgs({socket,setChatMessage, chatuserinfo,initialLoad}); //realtime messages function

  return (
    <>

      {messages.length > 0 ? (
        messages.map((msg, index) => (

          //  parent div
          <div
            key={`${index}-${msg._id}`}
            className={`relative flex ${msg.sender._id === data._id || msg.sender === data._id ? "justify-end" : "justify-start"
              }  mt-4`}
            onMouseEnter={() => setHoveredMessage(msg._id)}
            onMouseLeave={() => setHoveredMessage(null)}
            ref={(el) => (messageRefs.current[msg._id] = el)}

          >
            {/* checkboxes */}
            <Checkbox
              checkbox={checkbox}
              setForwardmsgid={setForwardmsgid}
              forwardmsgid={forwardmsgid}
              deltecheckbox={deltecheckbox}
              msg={msg}

            />

            {/* message container */}
            <div
              className={`relative min-w-[25%] lg:min-w-[10%] md:min-w-[20%] lg:max-w-[40%] md:max-w-[40%] mb-3 p-2 rounded-2xl ${msg.sender._id === data._id ? 'bg-gray-600 text-white' : 'bg-white'}`}
            >

              {/* display media file if reply is media{eg:audio,video and file} */}

              <Filtermediafile msg={msg} />


              <div className={`relative flex flex-col gap-2`}> {/* messagebody */}

                {/* text messages with reply as text messages */}

                <Textmsg msg={msg} data={data} highlightedId={highlightedId} />


                {/* display mediamessages */}

                {openMediaViewer &&
                  <Mediamessage
                    openMediaViewer={openMediaViewer}
                    media={msg.media}
                    msgid={msg._id}
                    sender={msg.sender}
                    loginuser={data._id}
                    chatuser={chatuserinfo.userId}
                    setUpdatemsgs={setUpdatemsgs}
                    socket={socket}

                  />
                }

                {/* message delivered undelivered icons */}

                <Msgdelivercheck
                  msg={msg}
                  data={data}
                />

                {msg.reactions?.length > 0 && (
                  <div className="flex flex-row gap-6">

                    {msg.reactions?.length > 0 && (
                      <div className="flex flex-row gap-6">
                        {msg.reactions.map((reaction) => (

                          !reaction.blockedbyuser.includes(data._id) && (
                            <div
                              key={reaction._id}
                              // Ensure the parent is relative
                              onMouseEnter={() => emojireactuser(reaction._id)}
                              onMouseLeave={() => emojireactuser('')}
                            >
                              {/*Reaction for both messages and media messages  */}

                              <Reaction
                                msg={msg}
                                data={data}
                                reaction={reaction}
                                chatuserinfo={chatuserinfo}
                                setUpdatemsgs={setUpdatemsgs}
                                socket={socket}

                              />

                              {/* Tooltip for both mediamessages and messages */}

                              <Tooltip
                                msg={msg}
                                reaction={reaction}
                                emojihoverid={emojihoverid}
                              />
                            </div>
                          )
                        ))}
                      </div>
                    )}
                  </div>

                )}

                {
                  msg?.media?.some(item => item?.reactions?.length > 0) &&
                  <div className="absolute bottom-0 z-40">
                    <BsEmojiSmileFill
                      className="text-yellow-500"
                      onClick={() => setMsgid(msg._id)}
                    />
                  </div>
                }

                {msgid === msg._id &&
                  <Mediareactions
                    msgid={msgid}
                    setMsgid={setMsgid}
                    loginuser={data._id}
                    chatuser={chatuserinfo.userId}
                    setUpdatemsgs={setUpdatemsgs}
                    socket={socket}

                  />
                }



              </div>

              {/* emoji picker */}

              {selectedMessage === msg._id && (
                <div
                  ref={emojiPickerRef} // Attach the ref here
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1000,
                  }}
                >
                  <EmojiPicker
                    onEmojiClick={(e) => {
                      addReaction(
                        msg._id,
                        msg.text ? msg.text : msg.media[0].text,
                        e.emoji,
                        chatuserinfo.userId,
                        userExists && chatuserinfo.status === 1 ? true : false);
                      setSelectedMessage(null);
                    }}
                  />
                </div>
              )}

              {/* dropdown and emoji buttons */}

              <Buttons
                msg={msg}
                data={data}
                chatuserinfo={chatuserinfo}
                hoveredMessage={hoveredMessage}
                setDropdown={setDropdown}
                setSelectedMessage={setSelectedMessage}
                setShowBlockNotification={setShowBlockNotification}
              />

              <Dropdown
                msg={msg}
                data={data}
                setReplymessage={setReplymessage}
                setDropdown={setDropdown}
                dropdown={dropdown}
                setUpdatemsgs={setUpdatemsgs}
                setForwardmsgid={setForwardmsgid}
                textareaRef={textareaRef}
                setCheckbox={setCheckbox}
                messagedropdown={messagedropdown}
              />

            </div>     {/*close message container */}

          </div>


        ))

      ) : (
        <p className="m-6">No messages available</p>
      )}
      {/* fixed components for messages */}

      {displayusers &&
        <Forwardmsgs
          setDisplayusers={setDisplayusers}
          forwardmsgids={forwardmsgid}
          setCheckbox={setCheckbox}
          setForwardmsgid={setForwardmsgid}
          forwardmsgobjid={forwardmsgobjid}
          setUpdatemsgs={setUpdatemsgs}
          chater={chater}
          initialLoad={initialLoad}



        />
      }

      {deltecheckbox &&
        <Deletemsgs
          forwardmsgids={forwardmsgid}
          setDeletemsgs={setDeletemsgs}
          setdeleteCheckbox={setdeleteCheckbox}
          setForwardmsgid={setForwardmsgid}
          loginuserid={data._id}
          setUpdatemsgs={setUpdatemsgs}
        />
      }


      {chatclear &&
       <Clearchat
          messagesIds={messagesids}
          setChatclear={setChatclear}
          chatuser={chatuserinfo.name}
          loginuserid={data._id}
          setUpdatemsgs={setUpdatemsgs}
        />


      }

      {
        showBlockNotification && (

          <Blocknotific
            onClose={() => setShowBlockNotification(false)}
            showBlockNotification={showBlockNotification}


          />

        )
      }

    </>
  );
};

export default Messages;
