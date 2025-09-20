import { FaSearch } from "react-icons/fa"

const searchbar = ({

  setSearchtext,
  searchtext,
  setReplymessage


}) => {
  return (
    <div className="mt-5 w-full h-[10vh]">
        <div className="flex relative">
          <input
            className="w-full h-10 m-5 p-2 outline-0 border border-gray-300 rounded-xl"
            type="text"
            value={searchtext}
            onChange={(e) => {
              setSearchtext(e.target.value)
              setReplymessage(false)
            }}
            placeholder="Search contacts or chats..."
          />
          <span className="absolute right-7 top-7">
            <FaSearch size={24} color="gray" />
          </span>
        </div>
      </div>
  )
}

export default searchbar