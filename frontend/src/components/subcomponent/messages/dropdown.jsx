import { backendbaseurl } from "../../../baseurl/baseurl"
import axios from "axios";
const Dropdown = (
    {
        msg,
        data,
        setReplymessage,
        setDropdown,
        dropdown,
        setUpdatemsgs,
        textareaRef,
        setCheckbox,
        setForwardmsgid,
        messagedropdown

    }) => {
   
    
    const replyHandler = (msg) => {

        textareaRef.current.focus()
        setReplymessage(msg)
        setDropdown({})

    }

    const removeMessage = async (userid, msgid) => {


        const result = await axios.delete(`${backendbaseurl}/api/chat/singlemsgdel/${msgid}`, { withCredentials: true })

        try {


            setDropdown({})
            setUpdatemsgs(Date.now())

        } catch (error) {

            console.log(error)
        }



    }

  

    return (
        <div>
            <div className={`${msg.sender._id !== data._id ? "absolute top-8 right-20" : "absolute top-8 left-3"}`}>
                {dropdown[msg._id] && (
                    <nav
                        ref={messagedropdown}
                        className="absolute cursor-pointer text-black bg-white text-center w-[92px] z-50"
                    >
                        <ul>
                            <li
                                className="border-b border-gray-200 p-2 hover:bg-gray-200"
                                onClick={() => {
                                    replyHandler({
                                        repliedtomsgId: msg._id,
                                        repliedmsg: msg.text ? msg.text : msg.media,
                                    })
                                    setCheckbox(false)
                                    setForwardmsgid([])
                                }}
                            >

                                Reply
                            </li>
                            <li className="border-b border-gray-200 p-2 hover:bg-gray-200"
                                onClick={() => setCheckbox(true)}
                            >
                                Forward
                            </li>
                            <li
                                className="border-b border-gray-200 p-2 hover:bg-gray-200"
                                onClick={() => {

                                    removeMessage(data._id, msg._id)
                                    setCheckbox(false)
                                    setForwardmsgid([])
                                }}
                            >
                                Remove
                            </li>
                        </ul>
                    </nav>
                )}
            </div>


        </div>
    )
}

export default Dropdown