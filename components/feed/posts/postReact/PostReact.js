import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useStateValue } from '../../../common/StateProvider';
import { db } from '../../../../firebase';
import CommentPost from './CommentPost';
import Comments from './Comments';
import { useCollection } from 'react-firebase-hooks/firestore';
import firebase  from "firebase";

// Icons
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';

function PostReact({ id, authorUID, liked, image, openComment }) {
    const useStyles = makeStyles((theme) => ({
        superSmall: {
          width: theme.spacing(2),
          height: theme.spacing(2),
        },
    }));

    const classes = useStyles();

    const [commentBox, setCommentBoxState] = useState(openComment)
    const [{ user }] = useStateValue();
    const [realtimeComments] = useCollection(
        db.collection('posts').doc(`${id}`).collection('comments')
    )

    const likeReact = () => {
        if (liked.users.includes(user.uid)) {
            db.doc(`posts/${id}`).update({
                liked: {
                    count: liked.count-1,
                    users: liked.users.filter(userData => userData !== user.uid)
                }
            })
        } else {
            db.doc(`posts/${id}`).update({
                liked: {
                    count: liked.count+1,
                    users: [...liked.users, user.uid]
                }
            })
            if (authorUID !== user.uid) {
                db.collection('users').doc(`${authorUID}`).collection('notification').doc(`${id}-likes`).set({
                    seen: false,
                    type: image ? 1 : 0,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    users: firebase.firestore.FieldValue.arrayUnion(`${user.uid}`)
                }, {merge: true})
            }
        }
    }

    return (
        <div className="mt-3 mx-5">
            {/* Post react analyze (number of liked, comments...) */}
            <div className="flex justify-between items-center">
                { liked.count !== 0 ? 
                    <div className="flex items-center space-x-2 my-2">
                        <div className="rounded-full bg-blue-400 p-1 flex items-center">
                            <ThumbUpIcon className={`${ classes.superSmall } text-white p-[2px]`}/>
                        </div>
                        <span className="text-gray-400">{ liked.count }</span>
                    </div>
                    :
                    <div></div>
                }
                { realtimeComments?.docs.length > 0 &&
                    <div onClick={ () => setCommentBoxState(!commentBox) } className="justify-self-end cursor-pointer text-gray-600 hover:underline">
                        <span>{ realtimeComments?.docs.length } bình luận</span>
                    </div>
                }
            </div>

            {/* Reaction */}
            <div className="grid grid-cols-3 border-t border-b border-gray-300 py-1">
                <button 
                    onClick={ likeReact }
                    className={`flex items-center justify-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-md w-full py-1 ${!liked.users.includes(user.uid) && 'text-gray-400'} ${liked.users.includes(user.uid) && 'text-blue-400'} font-bold`}
                >
                    <ThumbUpAltOutlinedIcon fontSize="small"/>
                    <span>Thích</span>
                </button>
                <label onClick={ () => setCommentBoxState(true) } htmlFor={`comment-${id}`} className="flex items-center justify-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-md w-full py-1 text-gray-400 font-bold">
                    <ChatBubbleOutlineOutlinedIcon fontSize="small"/>
                    <span>Bình luận</span>
                </label>
                <button className="flex items-center justify-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-md w-full py-1 text-gray-400 font-bold">
                    <ShareOutlinedIcon fontSize="small"/>
                    <span>Chia sẻ</span>
                </button>
            </div>
        
            { commentBox && 
                <div className="flex flex-col space-y-2 py-5">
                    {/* CommentPost */}
                    <CommentPost id={ id } authorUID={ authorUID } image={ image }/>

                    {/* Comments */}
                    <Comments id={ id }/>
                </div>
            } 
        </div>
    )
}

export default PostReact
