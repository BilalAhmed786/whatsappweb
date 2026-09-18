import { getlastemoji } from './getlastemoji';
import { countunreadmsgs } from './countunread';
import { FaCircle, FaMicrophone, FaFile } from 'react-icons/fa';
import Userpic from '../../../images/user.jpg';
import mediaMsgicon from './mediamsgicon';
import { format } from "timeago.js";
import { backendbaseurl } from '../../../baseurl/baseurl';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../../contextapi/contextapi';

const ChatUserList = ({ chatusers, lastmessage, data, notifymsg, setIndmsg, initialLoad, setSearchmsgid }) => {
  const { setNotific } = useContext(UserContext);

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

  useEffect(() => {
    setNotific(enrichedUsers);
  }, [lastmessage, chatusers]);

  return (
    <ul className="space-y-1">
      {enrichedUsers.map(({ user, lastMsg, reaction, count }, index) => (
        <li key={user._id || index}>
          <div
            className="group flex items-center p-2.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800/80 cursor-pointer transition-all duration-200"
            onClick={() => {
              if (!reaction || new Date(lastMsg?.createdAt) > new Date(reaction?.updatedAt)) {
                notifymsg(lastMsg?._id, user, lastMsg?.chatId, data._id);
                initialLoad.current = true;
              } else {
                notifymsg(reaction?.messageId, user, lastMsg?.chatId, data._id);

                if (count) {
                  initialLoad.current = false;
                  setSearchmsgid(reaction?.messageId);
                } else {
                  initialLoad.current = true;
                }
              }
              setIndmsg(1);
            }}
          >
            {/* Profile Picture */}
            <div className="relative flex-shrink-0">
              {user.profilepicture &&
              !data.blockedbyUsers.some((duser) => duser.userId === user._id) ? (
                <img
                  className="w-11 h-11 rounded-full object-cover border border-slate-700/60"
                  src={`${user.profilepicture}`}
                  alt="Profile"
                />
              ) : (
                <img
                  className="w-11 h-11 rounded-full object-cover border border-slate-700/60"
                  src={Userpic}
                  alt="Default Profile"
                />
              )}
              {!data.blockedUsers?.some((bdata) => bdata.userId === user._id) &&
                !data.blockedbyUsers?.some((buser) => buser.userId === user._id) &&
                user.status === 1 && (
                  <span className="absolute bottom-0 right-0 p-0.5 bg-slate-950 rounded-full">
                    <FaCircle className="text-emerald-500 text-[9px]" />
                  </span>
                )}
            </div>

            {/* Chat Content */}
            <div className="flex flex-col flex-1 min-w-0 ml-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs text-slate-200 group-hover:text-indigo-400 transition-colors truncate">
                  {user.name}
                </span>
                
                {/* Time */}
                <span className="text-[10px] text-slate-500 font-medium ml-2 flex-shrink-0">
                  {reaction && new Date(lastMsg?.createdAt) < new Date(reaction?.updatedAt)
                    ? format(reaction?.updatedAt)
                    : lastMsg?.createdAt
                    ? format(lastMsg?.createdAt)
                    : ""}
                </span>
              </div>

              <div className="flex items-center justify-between">
                {/* Message preview */}
                <div className="text-xs text-slate-400 truncate pr-2">
                  {!reaction || new Date(lastMsg?.createdAt) > new Date(reaction?.updatedAt) ? (
                    <div className="flex items-center space-x-1">
                      {lastMsg?.text
                        ? lastMsg.text
                        : mediaMsgicon(lastMsg?.media)}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      {reaction?.user?._id === data?._id ? (
                        <>
                          <span className="text-slate-500">{`You reacted ${reaction?.emoji} on `}</span>
                          {!reaction.text.includes(".") ? (
                            reaction.text ? (
                              <span>{`"${reaction.text}"`}</span>
                            ) : reaction.text.includes(".webm") ? (
                              <FaMicrophone className="inline text-slate-400 text-xs" />
                            ) : (
                              <FaFile className="inline text-slate-400 text-xs" />
                            )
                          ) : (
                            mediaMsgicon([{ text: reaction.text }])
                          )}
                        </>
                      ) : (
                        <>
                          <span className="text-slate-500">
                            {reaction?.user?.name ? `${reaction?.user?.name} reacted ${reaction?.emoji} on ` : ""}
                          </span>
                          {!reaction.text.includes(".") ? (
                            reaction.text ? (
                              <span>{`"${reaction.text}"`}</span>
                            ) : reaction.text.includes(".webm") ? (
                              <FaMicrophone className="inline text-slate-400 text-xs" />
                            ) : (
                              <FaFile className="inline text-slate-400 text-xs" />
                            )
                          ) : (
                            mediaMsgicon([{ text: reaction.text }])
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Unread Counter Badge */}
                {Boolean(count) && (
                  <span className="flex items-center justify-center h-4 min-w-[16px] px-1 bg-indigo-600 text-white font-bold text-[10px] rounded-full flex-shrink-0 shadow-sm">
                    {count}
                  </span>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ChatUserList;