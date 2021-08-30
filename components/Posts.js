import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from "../firebase";
import Post from './Post';


function Posts() {
    const [realTimePosts] = useCollection(
        db.collection('posts').orderBy('timestamp', 'desc')
    )
    
    return (
        <div className="flex flex-col space-y-4">
            {realTimePosts?.docs.map(post => (
                <Post 
                    key={ post.data().id }
                    name={ post.data().name }
                    profilePic={ post.data().profilePic }
                    content={ post.data().content }
                    timestamp={ post.data().timestamp }
                    image={ post.data().image }
                    activity={ post.data().activity }
                />
            ))}
        </div>
    )
}

export default Posts
