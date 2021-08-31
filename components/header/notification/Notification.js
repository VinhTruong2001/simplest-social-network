import { useStateValue } from '../../common/StateProvider';
import { useDocument, useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../../../firebase'
import FriendRequests from './friendRequests/FriendRequests';

import NotificationsIcon from '@material-ui/icons/Notifications';
import PostReact from './postReact/PostReact';

function Notification() {
    const [{ user }] = useStateValue();
    const [realTimeUserInfo] = useDocument(
        db.doc(`users/${user?.uid}`)
    )

    const [realtimeNotification] = useCollection(
        db.collection(`users/${user.uid}/notification`).where('seen', '==',false).limit(6)
    )
    const numberOfNotify = realTimeUserInfo?.data().friendRequestsPending?.length + realtimeNotification?.docs.length;
    
    return (
        <button className="relative group">
            <NotificationsIcon 
                fontSize="large" 
                className="icon-header text-[#6463ff]"
            />
            { numberOfNotify !== 0 &&
                <div className={ `absolute top-0 right-2 text-white text-xs w-4 h-4 ${numberOfNotify && 'bg-red-500'} rounded-full` }>
                    { numberOfNotify }
                </div>     
            }
           
            <div className="absolute right-[-24px] px-2 border border-gray-100 bg-white z-30 shadow-lg w-[360px] rounded-2xl origin-top transform scale-y-0 group-focus:scale-y-100 active:scale-y-100 transition">
                <div className="cursor-default">
            
                    {/* Friend requests */}
                    { realTimeUserInfo?.data().friendRequestsPending?.length !== 0 &&
                        <div className="text-left py-2">
                            <h3 className="font-bold text-xl px-3 pb-4">Lời mời kết bạn</h3>
                            <FriendRequests />
                        </div>
                    }
                    
                    {/* Post react (other user like or comment to your post) */}
                    <div className="text-left py-2">
                        <h3 className="font-bold text-xl px-3 pb-4">Thông báo</h3>
                        <PostReact />
                    </div>
                </div>
            </div>
        </button>
    )
}

export default Notification
