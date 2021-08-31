import { Avatar } from '@material-ui/core';
import { useRef, useState } from 'react';
import { db } from '../../../firebase';
import { useDocument } from 'react-firebase-hooks/firestore';
import PostReact from './postReact/PostReact';
import Link from 'next/link';

function Post({ id ,authorUID, content, image, video, timestamp, activity, liked, openComment }) {
    const contentRef = useRef("");
    const [seeMore, setSeeMore] = useState(false);
    const [authorInfo] = useDocument(
        db.doc(`users/${authorUID}`)
    )

    // Content expand (see more feature)
    const contentArray = content.split("<vinhtruong></vinhtruong>");

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

    let timeGap = () => {
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
        <div className="shadow-md pt-5 bg-white rounded-xl">
            {/* Post header */}
            <div className="flex space-x-2 px-4 ">
                <Link href={ `/profile/${authorUID}` }>
                   <a><Avatar src={authorInfo?.data().photoURL || ''} className="cursor-pointer"/></a>
                </Link>
                <div>
                    <div className="space-x-1">
                        <Link href={ `/profile/${authorUID}` }>
                            <a>
                                <h3 className="inline-block font-medium hover:underline cursor-pointer">
                                    { authorInfo?.data().displayName } 
                                </h3>
                            </a>
                        </Link>
                        <span className="text-gray-500">{ activity ? activity : '' }</span>
                    </div>
                    <p className="text-gray-500 font-semibold text-xs">
                        { timeGap() }
                     </p>
                </div>
            </div>

            {/* Post center */}
            <div className="mt-3 w-full">
                <div ref={ contentRef } className="px-4">{ !seeMore ? contentParsedShort : contentParsed }</div>
                { image && 
                    <div className="relative bg-white mt-3">
                        <img
                            src={ image }
                            className="object-cover w-full h-full"
                        />
                    </div>
                }
                { video &&
                    <video className="w-full h-full mt-3 object-fill" src={ video } controls></video>
                }
            </div>

            {/* Post bottom */}
            <PostReact 
                id={ id }
                authorUID={ authorUID }
                liked={ liked }
                image={ image }
                openComment={ openComment }
            />
        </div>
    )
}

export default Post
