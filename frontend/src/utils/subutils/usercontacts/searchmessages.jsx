import Userpic from '../../../images/user.jpg'
import { format } from 'timeago.js'
import { backendbaseurl } from '../../../baseurl/baseurl'
const searchmessages = ({messages,chatusers,data,notifymsg,chatId,setSearchmsgid}) => {
    return (
        <div>
            {messages.length > 0 && chatusers.length === 0 && (
                <>
                    {messages.map((message, index) =>
                        message.users.map((user) =>
                            user._id !== data._id ? (
                                <div key={`${index}-${user._id}`}

                                >
                                    {
                                        message.messages.map((msg, msgIndex) => (
                                            <div
                                                className="flex items-center gap-5 border-b border-gray-300 p-2"
                                                key={`${index}-${user._id}-${msgIndex}`}
                                                onClick={() =>{
                                                        notifymsg(msg._id, user, chatId, data._id)
                                                        setTimeout(()=>{
                                                            
                                                            setSearchmsgid(msg._id)

                                                         },2000)
                                                    }}
                                            >
                                                {/* Profile Picture */}

                                                {user.profilepicture && !data.blockedbyUsers.some((duser) => duser.userId === user._id) ?
                                                    <img
                                                        className="w-10 h-10 rounded-full"
                                                        src={`${backendbaseurl}/images/${user.profilepicture}`}
                                                        alt="Profile"
                                                    />
                                                    : <img className='w-10 h-10 border border-gray-300 rounded-full p-1' src={Userpic} />
                                                }
                                                {/* Message Text */}
                                                <div className='flex w-full justify-between'>
                                                    <span className="font-roboto font-light block text-xs md:text-sm text-gray-600">
                                                        {msg.text.length > 30 ? `${msg.text.substring(0, 30)}...` : msg.text}
                                                    </span>
                                                    <span className='text-xs text-gray-500'>{format(msg.createdAt)}</span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : null
                        )
                    )}
                </>
            )}



        </div>
    )
}

export default searchmessages
