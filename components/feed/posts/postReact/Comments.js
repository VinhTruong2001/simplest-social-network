import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '../../../../firebase' 
import Comment from './Comment'

function Comments({ id }) {
    const [realtimeComments] = useCollection(
        db.collection('posts').doc(`${id}`).collection('comments')
    )

    return (
        <>
            { realtimeComments?.docs.map(comment => (
                <Comment 
                    key={ comment.id }
                    id={ comment.id }
                    authorUID={ comment.data().commentAuthorUID }
                    comment={ comment.data().comment }
                    timestamp={ comment.data().timestamp }
                    image={ comment.data().image }
                    video={ comment.data().video }
                    liked={ comment.data().liked }
                />
              ))
            
            }
        </>
    )
}

export default Comments
