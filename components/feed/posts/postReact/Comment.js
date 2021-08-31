import Link from 'next/link';
import { useDocument } from 'react-firebase-hooks/firestore';
import { makeStyles } from '@material-ui/core/styles';
import { db } from '../../../../firebase' 
import { Avatar } from '@material-ui/core';
import { useState } from 'react';

function Comment({ authorUID, comment, timestamp, image, video, liked }) {
    const useStyles = makeStyles((theme) => ({
        small: {
          width: theme.spacing(4),
          height: theme.spacing(4),
        },
    }));
      
    const classes = useStyles();

    const [seeMore, setSeeMore] = useState(false);
    const [authorInfo] = useDocument(
        db.doc(`users/${authorUID}`)
    )

    let timeGap = () => {
        const today = new Date();
        const postDate = new Date(timestamp?.toDate());
        let dayGap = today.getDay() - postDate.getDay();
        let hourGap = today.getHours() - postDate.getHours();
        let minuteGap = today.getMinutes() - postDate.getMinutes();
        let result;

        if (dayGap === 0) {
            if (hourGap === 0) {
                if (minuteGap === 0) {
                    result = 'Vừa xong';
                }
                else {
                    result = minuteGap + ' phút';
                }
            } else {
                result = hourGap + ' giờ'
            }
        } else if (dayGap > 7 || dayGap < 0) {
            result = `${postDate.getDay()} tháng ${postDate.getMonth() + 1}, ${postDate.getFullYear()}` 
        } else {
            result = dayGap + ' ngày'
        }

        return result;
    }

    // Content expand (see more feature)
    const contentArray = comment.split("<vinhtruong></vinhtruong>");

    const contentParsed = contentArray.map((contentText, index) => (
        <div key={ index } >{ contentText }</div>
    ))

    const contentParsedShort = contentArray.map((contentText, index) => {
        if (index < 3)
            return <div key={ index } >{ contentText }</div>
        else if (index == 3)
            return (
                <div key={ index }>
                    <div>{ contentText }</div>
                    <button onClick={ () => { setSeeMore(true) } } className="font-semibold outline-none">... Xem thêm</button>
                </div>
            )
    })

    return (
        <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2 relative">
                <Link href={`/profile/${authorUID}`}>
                    <div className="self-start">
                        <Avatar src={ authorInfo?.data().photoURL } className={ classes.small }/>
                    </div>
                </Link>
                { comment === "" &&
                    <Link href={`/profile/${authorUID}`}>
                        <h3 className="font-semibold absolute top-0 left-10 z-20 cursor-pointer hover:underline">
                            { authorInfo?.data().displayName }
                        </h3>
                    </Link>
                }
                { comment !== "" &&
                    <div className="bg-gray-200 rounded-2xl py-1 px-3 relative w-max-full">
                        <Link href={`/profile/${authorUID}`}>
                            <h3 className="font-semibold cursor-pointer hover:underline">
                                { authorInfo?.data().displayName }
                            </h3>
                        </Link>
                        <div>
                            { !seeMore ? contentParsedShort : contentParsed }
                        </div>
                    </div>
                }
            </div>
            { image && <img src={ image } className="mx-10 w-[260px] cursor-pointer rounded-2xl "/> }
            { video && 
                <div className="w-full h-[304px] rounded-3xl overflow-hidden px-10" >
                    <video src={video} className="w-full h-full object-fill rounded-2xl" controls></video>
                </div>
            }
            <div className="flex space-x-2 mx-12">
                <span className="font-bold text-xs text-gray-500 cursor-pointer hover:underline">Thích</span>
                <span className="font-bold text-xs text-gray-500 cursor-pointer hover:underline">Phản hồi</span>
                <span className="text-xs text-gray-500 cursor-pointer hover:underline">
                    { timeGap() }
                </span>
            </div>
        </div>

    )
}

export default Comment
