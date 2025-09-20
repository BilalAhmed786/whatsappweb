import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaSearch, FaArrowLeft, FaEllipsisH } from 'react-icons/fa';
import { UserContext } from '../contextapi/contextapi';
import Userpic from '../images/user.jpg'
import { backendbaseurl } from '../baseurl/baseurl';


const Header = (
    { 
        setIndmsg,
        setShowUserList,
        setdeleteCheckbox,
        setChatclear, 
        setCheckbox,
        stateSearch,
        setForwardmsgid,
        setReplymessage,
        socket
    
    }) => {

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef(null); // Reference to the dropdown
    const { data, notific, chatuserinfo } = useContext(UserContext)
    const [messagecount, setMsgcount] = useState([])

    const totalcount = messagecount?.map((data) => data?.count || 0).reduce((a, b) => a + b, 0);


    const handleChatuser =()=>{


        socket.emit('chatuser',{chatuser:12345,loginuser:data._id})
        setShowUserList(true)
     
    }



    useEffect(() => {

        setMsgcount(notific)

    }, [notific])


    useEffect(() => {
        const handleClickOutside = (event) => {

            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownVisible(false); // Close dropdown if clicked outside
            }
        };


        if (isDropdownVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }


        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownVisible]);



    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
        setCheckbox(false)
        setReplymessage(false)
        setForwardmsgid([])
    };



    return (

        <div className='flex items-center justify-between w-full h-[10vh] p-[15px]'>
            <div className='absolute flex flex-col left-1'>
                <span className={`text-white absolute -top-5 left-0 lg:hidden px-2 py-1 text-xs ${totalcount ? 'bg-green-600' : ''} rounded-full`}>
                    {totalcount ? totalcount : ''}
                </span>
                <button
                    className='inline-block lg:hidden'
                    onClick={handleChatuser}
                ><FaArrowLeft />
                </button>
            </div>
            <div className='flex p-4'>
                {
                    chatuserinfo.profilepic && !data.blockedbyUsers.some((duser) => duser.userId === chatuserinfo.userId) ?
                        <img className="w-8 h-8 rounded-full" src={`${backendbaseurl}/images/${chatuserinfo.profilepic}`} alt="Profile" />

                        : <img className='w-10 border border-black rounded-full' src={Userpic} />
                }



                <div className='relative flex-col ml-3'>
                    <span className="block">{chatuserinfo.name}</span>

                    <div className="chat-user">
                        <div className="user-info">

                            {

                                !data.blockedUsers?.some((user) => user.userId === chatuserinfo.userId) &&
                                !data.blockedbyUsers?.some((user) => user.userId === chatuserinfo.userId) &&
                                chatuserinfo.status === 1 &&
                                (
                                    <span className="absolute left-1 top-5 text-sm text-green-500">online</span>
                                )
                            }
                        </div>
                    </div>


                </div>
            </div>

            <div className='flex'>
                <span className='cursor-pointer'>
                    <FaSearch onClick={() => {
                        setIndmsg(2)
                        setReplymessage(false)
                        stateSearch('')
                        
                    }} />
                </span>
                <span
                    className="block px-5 rotate-90 cursor-pointer"
                    onClick={toggleDropdown} // Toggle dropdown visibility on click
                >
                    <FaEllipsisH />
                </span>

                {/* Dropdown Menu */}
                <div
                    ref={dropdownRef} // Attach the ref to the dropdown
                    className={`absolute z-50 right-0 mt-12 py-2 w-48 bg-white border rounded shadow-lg transform transition-all duration-300 ease-in-out
                        ${isDropdownVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-5 scale-95 pointer-events-none'}`}
                >
                    <ul>
                        <li
                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => {
                                setIndmsg(3)
                                setdeleteCheckbox(false)
                                setChatclear(false)

                            }
                            }
                        >
                            View Profile
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => {
                                setChatclear(true)
                                setdeleteCheckbox(false)

                            }}
                        >
                            Clear Chat
                        </li>

                        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => {
                                setdeleteCheckbox(true)
                                setChatclear(false)
                            }
                            }
                        >
                            Remove Message
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    );
};

export default Header;
