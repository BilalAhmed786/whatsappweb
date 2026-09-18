import { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { UserContext } from "../contextapi/contextapi";
import axios from "axios";
import { backendbaseurl } from "../baseurl/baseurl";

const ForwardMessage = ({
  setDisplayusers,
  forwardmsgids,
  setCheckbox,
  setForwardmsgid,
  forwardmsgobjid,
  setUpdatemsgs,
  initialLoad,
  chater,
}) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [update, setUpdate] = useState("");
  const { data, socket, chatuserinfo } = useContext(UserContext);

  useEffect(() => {
    const datauser = async () => {
      try {
        const res = await axios.get(
          `${backendbaseurl}/api/users/userfwdmsg?loginuser=${data._id}&chatuser=${chatuserinfo.userId}&search=${search}`,
          { withCredentials: true }
        );
        if (data._id) {
          setUsers(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    datauser();
  }, [search]);

  useEffect(() => {
    setSelectedUsers((prev) =>
      prev.map((user) => {
        const hasMatch = chater.some(
          (existUser) =>
            existUser.chatuser.toString() === user.loginuser.toString() &&
            existUser.loginuser.toString() === user.chatuser.toString()
        );
        return hasMatch ? { ...user, isviewed: true } : user;
      })
    );
  }, [chater, update]);

  const handleCheckboxChange = (user, loginid) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((duser) => duser.chatuser === user._id);
      if (exists) {
        return prev.filter((duser) => duser.chatuser !== user._id);
      } else {
        const isBlocked = user.blockedUsers?.some(
          (blockedUser) => blockedUser.userId === loginid
        );
        return [
          ...prev,
          {
            chatuser: user._id,
            loginuser: loginid,
            isviewed: false,
            isblocked: isBlocked,
            name: user.name, // retained for selected badge previews
          },
        ];
      }
    });
    setUpdate(Date.now());
  };

  const handleSend = async (forwardmsgids, forwardmsgobjid, selectedUsers) => {
    try {
      let result;
      if (!forwardmsgobjid) {
        result = await axios.post(
          `${backendbaseurl}/api/chat/forwardmessage`,
          { forwardmsgids, selectedUsers },
          { withCredentials: true }
        );
        if (result.data) {
          socket?.emit("forwardmessages", result.data);
        }
      } else {
        result = await axios.post(
          `${backendbaseurl}/api/chat/singlemediafwd`,
          { forwardmsgids, forwardmsgobjid, selectedUsers },
          { withCredentials: true }
        );
        if (result.data) {
          socket?.emit("singlefwdchat", result.data);
          initialLoad.current = true;
        }
      }

      if (result.data) {
        setDisplayusers(false);
        setForwardmsgid("");
        setCheckbox(false);
        setUpdatemsgs(Date.now());
      }
    } catch (error) {
      console.error("Error forwarding message:", error);
    }
  };

  const handleClose = () => {
    setDisplayusers(false);
    setForwardmsgid("");
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all animate-fadeIn">
      <div className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
              Forward Message
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select contacts to share with
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative flex items-center">
            <svg className="absolute left-3.5 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search people..."
              value={search}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full rounded-xl bg-slate-100 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/40"
            />
          </div>
        </div>

        {/* Selected Users Pill Chips */}
        {selectedUsers.length > 0 && (
          <div className="flex gap-2 overflow-x-auto px-6 py-2 no-scrollbar">
            {selectedUsers.map((item) => (
              <span
                key={item.chatuser}
                className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300"
              >
                {item.name || "User"}
                <button
                  onClick={() => handleCheckboxChange({ _id: item.chatuser }, data._id)}
                  className="hover:opacity-75"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {/* User List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {users.length > 0 ? (
            users.map((user) => {
              const isSelected = selectedUsers.some(
                (slect) => slect.chatuser === user._id
              );
              return (
                <label
                  key={user._id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-colors ${
                    isSelected
                      ? "bg-indigo-50/60 dark:bg-indigo-950/30"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* User Avatar */}
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-sm font-bold text-white shadow-sm">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {user.name}
                      </span>
                      {user.email && (
                        <span className="text-xs text-slate-400">
                          {user.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Custom Styled Checkbox */}
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCheckboxChange(user, data._id)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-indigo-600 checked:bg-indigo-600 dark:border-slate-600"
                    />
                    <svg
                      className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </label>
              );
            })
          ) : (
            <div className="py-12 text-center text-sm text-slate-400">
              No contacts found
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 p-4 dark:border-slate-800">
          <button
            disabled={selectedUsers.length === 0}
            onClick={() => handleSend(forwardmsgids, forwardmsgobjid, selectedUsers)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            <span>Send</span>
            {selectedUsers.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold">
                {selectedUsers.length}
              </span>
            )}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default ForwardMessage;