import axios from 'axios'
import { backendbaseurl } from '../../../baseurl/baseurl'
const reaction = ({msg,data,reaction,chatuserinfo,setUpdatemsgs,socket}) => {

    

const undoReaction = async (msgId, objectId, chatuser) => {

    try {


      const result = await axios.post(`${backendbaseurl}/api/chat/undoreaction`, { msgId, objectId },{withCredentials:true})

      socket?.emit('messagereaction', { msg: result.data, receiverid: chatuser,loginuserid:data._id })

    //   setUpdatemsgs(Date.now())


    } catch (error) {

      console.log(error)
    }


  }

 return (
        <div>
            {msg.text ?
                <div
                    className="absolute cursor-pointer z-40 -bottom-8 border bg-white p-0.5 rounded-full"
                    onClick={() => {
                        if (reaction.user._id === data._id) {
                            undoReaction(msg._id, reaction._id, chatuserinfo.userId);
                        }
                    }}
                >
                    {reaction.emoji}
                </div>
                : <div
                    className="absolute cursor-pointer z-40 -bottom-7 border bg-white p-0.5 rounded-full"
                    onClick={() => {
                        if (reaction.user._id === data._id) {
                            undoReaction(msg._id, reaction._id, chatuserinfo.userId);
                        }
                    }}
                >
                    {reaction.emoji}
                </div>

            }


        </div>
    )
}

export default reaction