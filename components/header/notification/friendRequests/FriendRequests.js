import { useStateValue } from '../../../common/StateProvider';
import { useDocument } from 'react-firebase-hooks/firestore';
import { db } from '../../../../firebase';
import FriendRequest from './FriendRequest';

function FriendRequests() { 
    const [{ user }] = useStateValue();
    const [realTimeUserInfo] = useDocument(
        db.doc(`users/${user?.uid}`)
    )

    return (
        <div>
            { realTimeUserInfo?.data()?.friendRequestsPending.map(friendRequest => (
                <FriendRequest uid={ friendRequest }/>
              ))
            }
        </div>
    )
}

export default FriendRequests
