import React from "react";
import Userpic from "../../../images/user.jpg";
import { format } from "timeago.js";
import { FaFileAlt, FaMicrophone, FaRegCommentDots } from "react-icons/fa";

const SearchMessages = ({
  messages = [],
  chatusers = [],
  data = {},
  notifymsg,
  chatId,
  setSearchmsgid,
}) => {
  const shouldRender = messages.length > 0 && chatusers.length === 0;

  if (!shouldRender) return null;

  return (
    <div className="w-full space-y-2 p-2">
      {messages.map((messageGroup, groupIndex) =>
        messageGroup.users?.map((user) => {
          if (user._id === data._id) return null;

          const isBlocked = data.blockedbyUsers?.some(
            (bUser) => bUser.userId === user._id
          );

          return (
            <div
              key={`${groupIndex}-${user._id}`}
              className="flex flex-col gap-1.5"
            >
              {messageGroup.messages?.map((msg) => {
                const isMedia = !msg.text && msg.media?.length > 0;
                const isAudio = msg.text?.endsWith(".webm");

                return (
                  <div
                    key={msg._id}
                    onClick={() => {
                      notifymsg(msg._id, user, chatId, data._id);
                      setTimeout(() => {
                        setSearchmsgid(msg._id);
                      }, 2000);
                    }}
                    className="group relative flex items-center gap-3.5 p-3 rounded-2xl cursor-pointer transition-all duration-200 ease-out bg-slate-900/40 hover:bg-slate-800/80 border border-slate-800/60 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 backdrop-blur-md"
                  >
                    {/* User Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-slate-800 group-hover:ring-indigo-500/50 transition-all duration-300">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          src={
                            user.profilepicture && !isBlocked
                              ? user.profilepicture
                              : Userpic
                          }
                          alt={user.name || "User Avatar"}
                        />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col flex-1 min-w-0 justify-center">
                      {/* Top Row: User Name & Timestamp */}
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors truncate">
                          {user.name || "Contact"}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 group-hover:text-slate-400 ml-2 flex-shrink-0">
                          {msg.createdAt ? format(msg.createdAt) : ""}
                        </span>
                      </div>

                      {/* Bottom Row: Message Snippet */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-slate-300 truncate">
                        {isAudio ? (
                          <span className="flex items-center gap-1 text-indigo-400 text-xs">
                            <FaMicrophone className="text-xs" /> Voice Message
                          </span>
                        ) : isMedia ? (
                          <span className="flex items-center gap-1 text-indigo-400 text-xs">
                            <FaFileAlt className="text-xs" /> Attachment
                          </span>
                        ) : (
                          <p className="truncate font-normal">
                            {msg.text || (
                              <span className="italic text-slate-500">
                                Empty message
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subtle Right Indicator Icon on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-indigo-400/80 pr-1">
                      <FaRegCommentDots className="text-sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })
      )}
    </div>
  );
};

export default SearchMessages;