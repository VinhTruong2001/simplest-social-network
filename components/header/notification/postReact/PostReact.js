import { useStateValue } from '../../../common/StateProvider';
import { useCollection } from "react-firebase-hooks/firestore"
import { db } from "../../../../firebase"
import Like from './Like';
import Comment from './Comment';

function PostReact() {
    const [{ user }] = useStateValue();
    const [realtimeNotification] = useCollection(
        db.collection(`users/${user.uid}/notification`).orderBy('timestamp', 'desc').limit(6)
    )
    
    return (
        <div className="space-y-2">
            { realtimeNotification?.docs.map(notify => {
                if (notify.id.includes("likes")) {
                    return (
                        <Like 
                            key={ notify.id }
                            id={ notify.id.split('-')[0] }
                            uid={ notify.data().users.pop() }
                            number={ notify.data().users.length }    
                            timestamp={ notify.data().timestamp }
                            seen={ notify.data().seen }
                            type={ notify.data().type }
                        />
                    )
                } else {
                    return (
                        <Comment 
                            key={ notify.id }
                            id={ notify.id.split('-')[0] }
                            uid={ notify.id.split('-')[1] }   
                            timestamp={ notify.data().timestamp }
                            seen={ notify.data().seen }
                            type={ notify.data().type }
                        />
                    )
                }
            }) }
        </div>
    )
}

export default PostReact
