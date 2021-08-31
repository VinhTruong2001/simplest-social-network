import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import { useStateValue } from '../../common/StateProvider';
import { db } from "../../../firebase";
import Post from './Post';


function Posts({ uid }) {
    const [{ user }] = useStateValue();
    let realTimeUserProfile = null;
    if (uid) {
        [realTimeUserProfile] = useDocument(
            db.doc(`users/${uid}`)
        )
    }

    const [realtimeUserInfo] = useDocument(
        db.doc(`users/${user.uid}`)
    )

    const [realTimePosts] = useCollection(
        db.collection('posts').orderBy('timestamp', 'desc')
    )

    return (
        <div className="flex flex-col space-y-4">
            {realTimePosts?.docs.map(post => {
                const postElement = (
                    <Post 
                        key={ post.id }
                        id={ post.id }
                        authorUID={ post.data().authorUID }
                        content={ post.data().content }
                        timestamp={ post.data().timestamp }
                        image={ post.data().image }
                        video={ post.data().video }
                        activity={ post.data().activity }
                        liked={ post.data().liked }
                    />
                )
                if (uid) {
                    if (realTimeUserProfile?.data().posts.includes(post.id)) {
                        return postElement
                    } else return <></>
                } else if(realtimeUserInfo?.data().friends.includes(post.data().authorUID)) {
                    return postElement
                }
            })}
        </div>
    )
}

export default Posts
