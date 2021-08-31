import { useStateValue } from '../common/StateProvider';
import { useEffect, useRef, useState } from 'react';
import { db } from '../../firebase';
import firebase from 'firebase'
import { useDocument } from 'react-firebase-hooks/firestore';

// Icons
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import PeopleIcon from '@material-ui/icons/People';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';


function ProfileNav({ uid }) {
    const [{ user }] = useStateValue();
    const [userInfo] = useDocument(
        db.doc(`users/${user?.uid}`)
    );

    const [reachTop, setReachTop] = useState(false)
    const profileNavRef= useRef("");

    useEffect(() => {
        document.querySelector('.content-container').onscroll = () => {
            profileNavRef.current && setReachTop(profileNavRef.current.offsetTop > 537)
        }
    }, [])

    const sendFriendRequest = () => {
        db.doc(`users/${uid}`).set({
            friendRequestsPending: firebase.firestore.FieldValue.arrayUnion(`${user.uid}`),
        }, {merge: true});

        db.doc(`users/${user.uid}`).set({
            friendRequestsSent: firebase.firestore.FieldValue.arrayUnion(`${uid}`),
        }, {merge: true});
    }

    const disableFriendRequest = () => {
        db.doc(`users/${uid}`).set({
            friendRequestsPending: firebase.firestore.FieldValue.arrayRemove(`${user.uid}`),
        }, {merge: true});

        db.doc(`users/${user.uid}`).set({
            friendRequestsSent: firebase.firestore.FieldValue.arrayRemove(`${uid}`),
        }, {merge: true});
    }

    const acceptRequest = () => {
        db.doc(`users/${user.uid}`).set({
            friends: firebase.firestore.FieldValue.arrayUnion(`${uid}`),
            friendRequestsPending: firebase.firestore.FieldValue.arrayRemove(`${uid}`)
        }, {merge: true})

        db.doc(`users/${uid}`).set({
            friends: firebase.firestore.FieldValue.arrayUnion(`${user.uid}`),
            friendRequestsSent: firebase.firestore.FieldValue.arrayRemove(`${user.uid}`)
        }, {merge: true})
    }

    const declineRequest = () => {
        db.doc(`users/${user.uid}`).set({
            friendRequestsPending: firebase.firestore.FieldValue.arrayRemove(`${uid}`)
        }, {merge: true})

        db.doc(`users/${uid}`).set({
            friendRequestsSent: firebase.firestore.FieldValue.arrayRemove(`${user.uid}`)
        }, {merge: true})
    }

    const removeFriend = () => {
        db.doc(`users/${user.uid}`).set({
            friends: firebase.firestore.FieldValue.arrayRemove(`${uid}`)
        }, {merge: true})

        db.doc(`users/${uid}`).set({
            friends: firebase.firestore.FieldValue.arrayRemove(`${user.uid}`)
        }, {merge: true})
    }

    return (
        <div ref={ profileNavRef } className={`xl:mx-[180px] lg:sticky lg:top-[73px] z-30 flex flex-col-reverse pt-3 md::mt-0 md:flex-row items-center justify-between mx-2 md:px-10 bg-white shadow-md ${reachTop && 'xl:px-[220px] xl:mx-0'} transition-all`}>
            <ul className="flex pt-1 w-full md:w-3/5">
                <li className="cursor-pointer w-1/4 text-center text-gray-500 text-blue-500 border-b-4 border-blue-500">
                    <div className="p-3 font-semibold hover:bg-gray-200 rounded-md">Bài viết</div>
                </li>
                <li className="cursor-pointer w-1/4 text-center text-gray-500">
                    <div className="p-3 font-semibold hover:bg-gray-200 rounded-md">Bạn bè</div>
                </li> 
                <li className="cursor-pointer w-1/4 text-center text-gray-500">
                    <div className="p-3 font-semibold hover:bg-gray-200 rounded-md">Ảnh</div>
                </li> 
                <li className="cursor-pointer w-1/4 text-center text-gray-500 ">
                    <div className="p-3 font-semibold hover:bg-gray-200 rounded-md">Video</div>
                </li> 
            </ul>

            <div className="flex space-x-3 w-full md:w-[30%] px-2 md:px-0">
                { userInfo?.data().friends?.includes(uid) ?
                    <div className="flex-1 lg:flex-0 flex space-x-3 items-center">
                        <button className="btn-cancel cursor-pointer relative w-1/2 p-2 group">
                            <div className="flex justify-center items-center space-x-2 font-semibold">
                                <PeopleIcon />
                                <span>Bạn bè</span>
                            </div>
                            
                            <div className="absolute z-30 right-[-50px] left-0 text-gray-600 bg-white shadow-xl p-3 mt-3 border border-gray-200 rounded-md origin-top transform scale-y-0 group-focus:scale-y-100 active:scale-y-100 transition">
                                <button className="flex items-center space-x-3 text-left font-bold p-2 hover:bg-gray-100 rounded-md w-full">
                                    <StarBorderIcon />
                                    <span>Yêu thích</span>
                                </button>
                                <button className="flex items-center space-x-3 text-left font-bold p-2 hover:bg-gray-100 rounded-md w-full">
                                    <RemoveCircleOutlineIcon />
                                    <span>Bỏ theo dõi</span>
                                </button>
                                <button onClick={ removeFriend } className="flex items-center space-x-3 text-left font-bold p-2 hover:bg-gray-100 rounded-md w-full">
                                    <PersonAddDisabledIcon />
                                    <span>Hủy kết bạn</span>
                                </button>
                            </div>
                        </button>
                        <button className="btn-primary w-1/2 p-2">
                            <div className="flex justify-center items-center space-x-2 font-semibold">
                                <ChatBubbleIcon />
                                <span>Nhắn tin</span>
                            </div>
                        </button>
                    </div>
                    :
                    <button className="btn-primary flex-1 lg:flex-0 p-2 relative group">
                        {/* Current profile */}
                        { user.uid === uid &&
                            <div className="flex justify-center items-center space-x-2 font-semibold">
                                <AddCircleIcon />
                                <span>Thêm vào tin</span>
                            </div>
                        }

                        {/* Add friend Btn */}
                        {(user.uid !== uid && 
                        !userInfo?.data().friendRequestsPending?.includes(uid) && 
                        !userInfo?.data().friendRequestsSent?.includes(uid)) && 
                            <div onClick={ sendFriendRequest } className="flex justify-center items-center space-x-2 font-semibold">
                                <PersonAddIcon />
                                <span>Kết bạn</span>
                            </div>
                        }

                        {/* Wait for respose */}
                        { user.uid !== uid && 
                        userInfo?.data().friendRequestsPending?.includes(uid) &&
                            <>
                            <div className="flex justify-center items-center space-x-2 font-semibold">
                                <RecordVoiceOverIcon />
                                <span>Phản hồi</span>
                            </div>

                            <div className="absolute z-30 right-0 left-0 text-gray-600 bg-white shadow-xl p-3 mt-3 border border-gray-200 rounded-md origin-top transform scale-y-0 group-focus:scale-y-100 active:scale-y-100 transition">
                                <button onClick={ acceptRequest } className="block text-left font-bold p-2 hover:bg-gray-100 rounded-md w-full">Chấp nhận</button>
                                <button onClick={ declineRequest } className="block text-left font-bold p-2 hover:bg-gray-100 rounded-md w-full">Từ chối</button>
                            </div>
                            </>
                        }

                        {/* Decline accept */}
                        { userInfo?.data().friendRequestsSent?.includes(uid) && 
                            <div onClick={ disableFriendRequest } className="flex justify-center items-center space-x-2 font-semibold">
                                <PersonAddDisabledIcon />
                                <span>Hủy kết bạn</span>
                            </div>
                        }
                    </button>
                }
                <button className="btn-cancel text-black p-2">
                    <MoreHorizIcon />
                </button>
            </div>
        </div>
    )
}

export default ProfileNav
