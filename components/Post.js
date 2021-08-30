import { Avatar } from '@material-ui/core';
import { useRef, useState } from 'react';

// Icons
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined';
import ShareOutlinedIcon from '@material-ui/icons/ShareOutlined';

function Post({ name, profilePic, content, image, timestamp, activity }) {
    const contentRef = useRef("");
    const [seeMore, setSeeMore] = useState(false);
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
    
    return (
        <div className="shadow-md py-5 bg-white rounded-xl">
            {/* Post header */}
            <div className="flex space-x-2 px-4 ">
                <Avatar src={profilePic || ''}/>
                <div>
                    <div className="flex space-x-1">
                        <h3 className="font-medium">
                            { name } 
                        </h3>
                        <span className="text-gray-500">{ activity ? activity : '' }</span>
                    </div>
                    <p className="text-gray-400 text-xs">{ 
                        new Date(timestamp?.toDate()).toLocaleString()
                     }</p>
                </div>
            </div>

            {/* Post center */}
            <div className="py-3 w-full">
                <div ref={ contentRef } className="px-4">{ !seeMore ? contentParsedShort : contentParsed }</div>
                { image && 
                    <div className="relative bg-white mt-3">
                        <img
                            src={ image }
                            className="object-cover w-full h-full"
                        />
                    </div>
                }
            </div>

            {/* Post bottom */}
            <div className="mt-3">
                {/* Reaction */}
                <div className="grid grid-cols-3 border-t border-b border-gray-300 mx-4 py-1">
                    <div className="flex items-center justify-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-md w-full py-1 text-gray-500 font-bold">
                        <ThumbUpAltOutlinedIcon fontSize="small"/>
                        <span>Thích</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-md w-full py-1 text-gray-500 font-bold">
                        <ChatBubbleOutlineOutlinedIcon fontSize="small"/>
                        <span>Bình luận</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-md w-full py-1 text-gray-500 font-bold">
                        <ShareOutlinedIcon fontSize="small"/>
                        <span>Chia sẻ</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post
