import Link from "next/link";
import { useStateValue } from '../../../common/StateProvider';
import { useDocument } from "react-firebase-hooks/firestore";
import { db } from '../../../../firebase';
import { makeStyles } from '@material-ui/core/styles';
import { useRef } from "react";

import { Avatar } from "@material-ui/core";
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';

function Comment({ id, uid , timestamp, seen, type }) {
    const useStyles = makeStyles((theme) => ({
        large: {
          width: theme.spacing(7),
          height: theme.spacing(7),
        },
    }));
      
    const classes = useStyles();

    const [{ user }] = useStateValue();
    const postLinkRef = useRef("");
    const [reactUser] = useDocument(
        db.doc(`users/${uid}`)
    )

    const changeNotifyState = () => {
        db.collection('users').doc(`${user.uid}`).collection('notification').doc(`${id}-${uid}-comment`).update({
            seen: true,
        })
    }

    const timeGap = () => {
        const today = new Date();
        const postDate = new Date(timestamp?.toDate());
        let dayGap = today.getDate() - postDate.getDate();
        let hourGap = today.getHours() - postDate.getHours();
        let minuteGap = today.getMinutes() - postDate.getMinutes();
        let result;

        if (dayGap === 0) {
            if (hourGap === 0) {
                if (minuteGap === 0) {
                    result = 'Vừa xong';
                }
                else {
                    result = minuteGap + ' phút trước';
                }
            } else {
                result = hourGap + ' giờ trước'
            }
        } else if (dayGap > 7 || dayGap < 0) {
            result = `${postDate.getDay()} tháng ${postDate.getMonth() + 1}, ${postDate.getFullYear()}` 
        } else {
            result = dayGap + ' ngày trước'
        }

        return result;
    }
    
    return (
        <Link href={`/posts/${id}`}>
            <a>    
                <div onClick={ changeNotifyState } className="flex space-x-5 cursor-pointer relative hover:bg-gray-200 p-2 rounded-xl">
                    <div className="mt-1 relative">
                        <Avatar src={ reactUser?.data().photoURL } className={ classes.large }/>
                        <div className="absolute -right-3 top-8 rounded-full p-1 bg-green-400 flex items-center">
                            <ChatBubbleIcon fontSize="small" className="text-white"/>
                        </div>
                    </div>
                    <div className="space-x-1 text-gray-700">
                        <span className="font-semibold">{reactUser?.data().displayName}</span>
                        <span>đã bình luận về {type ? 'ảnh' : 'bài viết'} của bạn</span>
                        <p className="text-sm">{ timeGap() }</p>
                    </div>
                    { !seen &&
                        <div className="flex items-center">
                            <div className="bg-blue-400 rounded-full w-3 h-3"></div>
                        </div>
                    }
                </div>
            </a>
        </Link>
    )
}

export default Comment
