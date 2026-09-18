import { FaSearch, FaTimes } from "react-icons/fa";

const Searchbar = ({ setSearchtext, searchtext, setReplymessage }) => {
  return (
    <div className="p-3 bg-slate-900/30 border-b border-slate-800/60">
      <div className="relative flex items-center w-full">
        <FaSearch className="absolute left-3.5 text-slate-500 text-xs pointer-events-none" />
        <input
          className="w-full pl-9 pr-8 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          type="text"
          value={searchtext}
          onChange={(e) => {
            setSearchtext(e.target.value);
            setReplymessage(false);
          }}
          placeholder="Search contacts or chats..."
        />
        {searchtext && (
          <button
            onClick={() => setSearchtext('')}
            className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <FaTimes className="text-xs" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Searchbar;