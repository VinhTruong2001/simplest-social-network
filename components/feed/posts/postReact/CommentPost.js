import { useStateValue } from '../../../common/StateProvider';
import { makeStyles } from '@material-ui/core/styles';
import firebase from 'firebase'
import { db, storage } from '../../../../firebase';
import { Avatar } from '@material-ui/core';
import { useRef, useState, useEffect } from 'react';
import { isImage } from "../../../../utils/checkFile";
// import Picker from 'emoji-picker-react';
// import dynamic from 'next/dynamic';
// const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });


// icons
import EmojiEmotionsOutlinedIcon from '@material-ui/icons/EmojiEmotionsOutlined';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import CloseIcon from '@material-ui/icons/Close';

function CommentPost({ id, authorUID, image }) {
    const useStyles = makeStyles((theme) => ({
        small: {
          width: theme.spacing(4),
          height: theme.spacing(4),
        },
    }));
      
    const classes = useStyles();

    const [{ user }] = useStateValue();
    const commentInputRef = useRef("");
    const filePickerRef = useRef("");
    const [fileToPost, setFileToPost] = useState(null);
    const [videoURL, setVideoURL] = useState(""); 
    // const [chosenEmoji, setChosenEmoji] = useState(null);

    // useEffect(() => {
    //     if (chosenEmoji) {
    //         commentInputRef.current.value += chosenEmoji.emoji;
    //     }
    // }, [chosenEmoji])

    // const onEmojiClick = async (event, emojiObject) => {
    //     setChosenEmoji(emojiObject);
    // };

    const autoChangeHeight = (e) => {
        commentInputRef.current.style.height = "";
        commentInputRef.current.style.height = Math.min(commentInputRef.current.scrollHeight, Number.MAX_SAFE_INTEGER) + "px";
    }

    const expandCommentAnimation = () => {
        commentInputRef.current.parentNode.classList.add("min-h-[56px]");
    }

    const shrinkCommentAnimation = () => {
        commentInputRef.current.parentNode.classList.remove("min-h-[56px]");
    }

    const disableEnter = (e) => {
        if (e.keyCode == 13 && !e.shiftKey) {
            e.preventDefault();
            postCommentToServer();
        }
    }

    const postCommentToServer = () => {
        if (commentInputRef.current.value.trim() === '' && !fileToPost) return;

        db.doc(`posts/${ id }`).collection('comments').add({
            commentAuthorUID: user.uid,
            comment: commentInputRef.current.value.replace(/\r\n|\r|\n/g, "<vinhtruong></vinhtruong>"),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            liked: {    
                count: 0,
                users: [],
            }
        }).then(doc => {
            if (fileToPost) {
                const uploadTask = storage.ref(`posts/${id}/comment/${doc.id}`).putString(fileToPost, 'data_url');
                removeImage();

                uploadTask.on('state_changed', null, 
                    (error) => console.error(error),
                    () => {
                        storage.ref(`posts/${id}/comment/${doc.id}`).getDownloadURL().then(url => {
                            if (isImage(fileToPost)) {
                                db.doc(`posts/${id}`).collection('comments').doc(`${doc.id}`).update({
                                    image: url
                                }, {merge: true});
                            }
                            else {
                                db.doc(`posts/${id}`).collection('comments').doc(`${doc.id}`).update({
                                    video: url
                                }, {merge: true});
                            }
                        })
                    }
                )
            } 

            commentInputRef.current.value = "";
            commentInputRef.current.style.height = "24px"
        })

        if (authorUID !== user.uid) {
            db.collection('users').doc(`${authorUID}`).collection('notification').doc(`${id}-${user.uid}-comment`).set({
                seen: false,
                type: image ? 1 : 0,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            }, {merge: true})
        }
    }

    const addfileToPost = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
            setVideoURL(window.URL.createObjectURL(e.target.files[0]));
        }
        
        reader.onload = (readerEvent) => {
            setFileToPost(readerEvent.target.result)
        }
    }

    const removeImage = () => {
        setFileToPost(null);
    }

    return (
        <form >
            <div className="flex items-center space-x-2">
                <div className="self-start">
                    <Avatar src={ user.photoURL } className={ classes.small }/>
                </div>
                <div className="bg-gray-200 rounded-2xl flex-1 py-1 px-4 relative transition-height duration-[500]">
                    <textarea 
                        ref={ commentInputRef }
                        onFocus={ expandCommentAnimation }
                        onBlur={ shrinkCommentAnimation }
                        onInput={ autoChangeHeight }
                        onKeyDown={ disableEnter }
                        type="text" 
                        id={`comment-${id}`}    
                        placeholder="Viết bình luận..."
                        className="outline-none bg-transparent block resize-none box-border flex-1 w-full"
                        rows="1"
                    ></textarea>
                    <div className="flex space-x-1 absolute bottom-1 right-2 text-gray-400">
                        <div className="cursor-pointer relative group">
                            <EmojiEmotionsOutlinedIcon />
                            
                            {/* <div className="absolute z-10  h-8  transition">
                                <Picker onEmojiClick={ onEmojiClick }/>
                            </div> */}
                        </div>
                        <div onClick={ () => filePickerRef.current.click() } className={ `cursor-pointer ${fileToPost && 'hidden'}` }>
                            <CameraAltOutlinedIcon />
                        </div>
                    </div>
                </div>
            </div>
            { fileToPost && 
                <div className="mt-2 ml-10 relative">
                    { isImage(fileToPost) ?
                        <img src={ fileToPost } className="w-24" />
                        :
                        <video className="w-full rounded-2xl mx-auto" src={ videoURL } controls></video>
                    }
                    <div
                        onClick={ removeImage } 
                        className="flex items-center p-1 bg-gray-200 rounded-full absolute top-0 right-0 cursor-pointer">
                        <CloseIcon fontSize="small" />
                    </div>
                </div>
            }
            <input 
                ref={ filePickerRef } 
                onChange={ addfileToPost } 
                type="file" 
                accept="image/png, image/gif, image/jpeg, video/mp4,video/x-m4v,video/*"
                hidden 
            />
        </form>
    )
}

export default CommentPost
