import { getlastemoji } from './getlastemoji';
import { countunreadmsgs } from './countunread';
import { FaCircle, FaMicrophone, FaFile } from 'react-icons/fa';
import Userpic from '../../../images/user.jpg'
import mediaMsgicon from './mediamsgicon';
import { format } from "timeago.js";
import { backendbaseurl } from '../../../baseurl/baseurl';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../../contextapi/contextapi';
const ChatUserList = ({ chatusers, lastmessage, data, notifymsg, setIndmsg, initialLoad, setSearchmsgid }) => {
  const { setNotific } = useContext(UserContext)
  const enrichedUsers = chatusers.map((user) => {
    const userMessages = lastmessage?.filter((msg) =>
      msg.users?.includes(user._id)
    );



    const lastMsg =
      userMessages.length > 0
        ? userMessages[0]?.messages[userMessages[0].messages.length - 1]
        : null;

    const reaction = getlastemoji(userMessages[0]?.messages, data);
    const count = countunreadmsgs(userMessages[0]?.messages, data, user);

    return { user, lastMsg, reaction, count };
  });

  enrichedUsers.sort((a, b) => {
    const aTime = new Date(
      a.reaction && new Date(a.lastMsg?.createdAt) < new Date(a.reaction?.updatedAt)
        ? a.reaction?.updatedAt
        : a.lastMsg?.createdAt || 0
    ).getTime();

    const bTime = new Date(
      b.reaction && new Date(b.lastMsg?.createdAt) < new Date(b.reaction?.updatedAt)
        ? b.reaction?.updatedAt
        : b.lastMsg?.createdAt || 0
    ).getTime();

    return bTime - aTime;
  });

  //data user count etc share with contextapi for mobile notification
  useEffect(() => {

    setNotific(enrichedUsers)

  }, [lastmessage, chatusers])

  return (
    <ul className="space-y-2">
      {enrichedUsers.map(({ user, lastMsg, reaction, count }, index) => (
        <li key={index} className="border-b border-gray-300 p-2">
          <div
            className="flex hover:scale-[102%] hover:bg-slate-200 hover:rounded-md transition-all duration-300 p-2"
            onClick={() => {
              if (!reaction || new Date(lastMsg?.createdAt) > new Date(reaction?.updatedAt)) {

                notifymsg(lastMsg?._id, user, lastMsg?.chatId, data._id); //for lastmessage not reaction
                initialLoad.current = true
              } else {
                notifymsg(reaction?.messageId, user, lastMsg?.chatId, data._id);////for lastmessage reaction

                if (count) {
                  initialLoad.current = false
                  setSearchmsgid(reaction?.messageId)
                } else {
                  initialLoad.current = true

                }
              }
              setIndmsg(1);





            }}
          >
            {/* Profile Picture */}
            <div className="relative">
              {user.profilepicture &&
                !data.blockedbyUsers.some((duser) => duser.userId === user._id) ? (
                <img
                  className="w-14 h-12 rounded-full"
                  src={`${backendbaseurl}/images/${user.profilepicture}`}
                  alt="Profile"
                />
              ) : (
                <img
                  className="w-14 h-12 border border-gray-300 rounded-full p-1"
                  src={Userpic}
                  alt="Default Profile"
                />
              )}
              {!data.blockedUsers?.some((bdata) => bdata.userId === user._id) &&
                !data.blockedbyUsers?.some((buser) => buser.userId === user._id) &&
                user.status === 1 && (
                  <span className="absolute text-[9px] top-0">
                    <FaCircle className="text-green-400" />
                  </span>
                )}
            </div>

            {/* Chat Content */}
            <div className="flex-col w-full ml-2">
              <span className="font-sans font-normal text-sm">{user.name}</span>
              <div className="flex justify-between">
                {/* Last Message / Reaction */}
                {!reaction || new Date(lastMsg?.createdAt) > new Date(reaction?.updatedAt) ? (
                  <div className="flex text-gray-600">
                    {lastMsg?.text
                      ? lastMsg.text.length > 15
                        ? `${lastMsg.text.substring(0, 15)}...`
                        : lastMsg.text
                      : mediaMsgicon(lastMsg?.media)}
                  </div>
                ) : (
                  <div className="flex text-gray-600">
                    {reaction?.user?._id === data?._id ? (
                      <>
                        {`you reacted ${reaction?.emoji} on `}
                        {!reaction.text.includes(".") ? (
                          reaction.text ? (
                            reaction.text.length > 7
                              ? `"${reaction.text.substring(0, 7)}..."`
                              : `"${reaction.text}"`
                          ) : reaction.text.includes(".webm") ? (
                            <FaMicrophone />
                          ) : (
                            <FaFile />
                          )
                        ) : (
                          mediaMsgicon([{ text: reaction.text }])
                        )}
                      </>
                    ) : (
                      <>
                        {reaction?.user?.name
                          ? `${reaction?.user?.name} reacted ${reaction?.emoji} on `
                          : ""}
                        {!reaction.text.includes(".") ? (
                          reaction.text ? (
                            reaction.text.length > 7
                              ? `"${reaction.text.substring(0, 7)}..."`
                              : `"${reaction.text}"`
                          ) : reaction.text.includes(".webm") ? (
                            <FaMicrophone />
                          ) : (
                            <FaFile />
                          )
                        ) : (
                          mediaMsgicon([{ text: reaction.text }])
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Unread Messages Count */}

                <div className={`flex mt-1 items-center justify-center w-5 h-5 p-2 text-[12px] text-white ${count ? 'bg-green-500' : ''} rounded-full`}>
                  {count ? count : ''}
                </div>


                {/* Last Message Time */}
                <span className="text-[10px] text-gray-500">
                  {reaction && new Date(lastMsg?.createdAt) < new Date(reaction?.updatedAt)
                    ? format(reaction?.updatedAt)
                    : lastMsg?.createdAt
                      ? format(lastMsg?.createdAt)
                      : ""}
                </span>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ChatUserList;
