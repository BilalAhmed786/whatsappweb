import { FaTrash, FaBan, FaTimes } from "react-icons/fa";
import { UserContext } from "../contextapi/contextapi";
import { useContext, useEffect, useState } from "react";
import Userpic from '../images/user.jpg'
import axios from "axios";
import { backendbaseurl } from "../baseurl/baseurl";

const UserProfile = (
  {
    setIndmsg,
    openMediaViewer,
    updatemsgs,
    mediamsgupdate
  }
) => {
  const { fetchUserInfo, socket, data, chatuserinfo } = useContext(UserContext);
  const [media, setMedia] = useState([]);



  const blockUser = async (loginid, blockUserId) => {

    try {

      const result = await axios.post(`${backendbaseurl}/api/users/blkunblk-user/${loginid}`, { blockUserId },{withCredentials:true})

        if (result.data) {

          await fetchUserInfo();

         socket?.emit('blockuser',{user:result.data})

      }

    } catch (error) {

      console.log(error)
    }



  }



  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const result = await axios.get(`${backendbaseurl}/api/chat/mediamessage/${chatuserinfo.userId}`,{withCredentials:true});



        const allMedia = result.data?.messages.map((msg) => msg.media).flat();


        // Filter out document files
        const filteredMedia = allMedia.filter((file) => {

          const fileExtension = file.text.split(".").pop().toLowerCase();
          return !["doc", "docx", "pdf", "webm"].includes(fileExtension);
        });


        setMedia(filteredMedia);
      

      } catch (error) {
        console.error(error);
      }
    };

    if (data._id) {
      fetchMedia();
    }
  }, [chatuserinfo, data._id, updatemsgs,mediamsgupdate]);

  // socket working


  useEffect(() => {

    if (!socket) return;

    const handleAllmedia = (data) => {
     

      setMedia((prev) =>

        [...prev,...data.lastmsg.media]



      )

    }


    socket?.on('latestmsg', handleAllmedia)

    return () => {

      socket?.off('latestmsg', handleAllmedia)

    }




  }, [socket])




  return (
    <div className="custom-scrollbar w-full h-screen overflow-auto">
      <span
        className="block m-3 cursor-pointer"
        onClick={() => setIndmsg(1)}
      >
        <FaTimes />
      </span>
      <h5 className="ml-5 mt-5">Contact Info</h5>
      <div className="flex justify-center">

        {chatuserinfo?.profilepic && !chatuserinfo.blockedUsers?.some((blck)=>blck.userId === data._id) ?
          <img
            className="w-60 h-60 rounded-full"
            src={`${backendbaseurl}/images/${chatuserinfo.profilepic}`}
            alt="Profile"
          />
          :

          <img className="w-40 h-40 rounded-full border border-black" src={Userpic} />
        }

      </div>
      <div className="text-center mt-2">
        <h2>{chatuserinfo.name}</h2>
      </div>
      <div className="border-t-8 border-b-8 via-gray p-5 mt-5">
        <h4>About</h4>
        <p>{chatuserinfo.about}</p>
      </div>
      <div className={`border-b-8 via-gray p-5 mt-6 ${media?.length ? "h-auto" : "h-22"} overflow-auto`}>
        <h4 className="mb-2">Images and videos share with <b className="text-gray-500">{chatuserinfo.name}</b></h4>
        {media?.length > 0 ? (
          <div
            className="flex gap-2 w-full h-40 cursor-pointer"
            onClick={() => openMediaViewer(media)}
          >
            {
              media
                .filter((file) =>
                  ["jpg", "jpeg", "png", "mp4", "avi", "mov"].some((ext) =>
                    file.text?.toLowerCase().includes(ext)
                  )
                )
                .slice(0, 4)
                .map((file, index) => {
                  if (["jpg", "jpeg", "png"].some((ext) => file.text.toLowerCase().includes(ext))) {
                    return (
                      <img
                        key={index}
                        className="w-40 h-40 object-cover"
                        src={`${backendbaseurl}/images/${file.text}`}
                        alt={`Media ${index}`}
                      />
                    );
                  } else if (["mp4", "avi", "mov"].some((ext) => file.text.toLowerCase().includes(ext))) {
                    return (
                      <video
                        key={index}
                        className="w-40 h-40 object-cover"
                        controls
                        onClick={(e) =>
                          e.preventDefault()}
                      >
                        <source src={`${backendbaseurl}/videos/${file.text}`} type={`video/${file.text.split('.').pop()}`} />
                        Your browser does not support the video tag.
                      </video>
                    );
                  } else {
                    return null;
                  }
                })
            }


          </div>
        ) : (

          <p className="text-gray-500 mb-2">No media available.</p>

        )}
      </div>
      <div className="border-b-8 text-red-500 flex flex-col via-gray p-5 mt-5">
        <span
          className="flex cursor-pointer gap-2"
          onClick={() => blockUser(data._id, chatuserinfo.userId)}
        >
          <FaBan className="mt-1" />
          {
            data.blockedUsers?.some(user => user.userId === chatuserinfo.userId)
              ? 'Unblock User'
              : 'Block User'
          }

        </span>
      </div>
    </div>
  );
};

export default UserProfile;