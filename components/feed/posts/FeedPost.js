import Image from "next/image";
import { useRef, useState } from "react";
import { useStateValue } from '../../common/StateProvider';
import { actionTypes } from '../../common/reducer';
import firebase  from "firebase";
import { db, storage } from '../../../firebase' 
import { isImage } from "../../../utils/checkFile";

// Icons
import Avatar from "@material-ui/core/Avatar";
import CloseIcon from '@material-ui/icons/Close';

function FeedPost({ name, uid }) {
    const [{ user, postModalStatus }, dispatch] = useStateValue();

    const postContentRef = useRef("");
    const submitBtnRef = useRef("");
    const filePickerRef = useRef("");
    const [fileToPost, setFileToPost] = useState(null);
    const [videoURL, setVideoURL] = useState(""); 

    const postToServer = (e) => {
        e.preventDefault();
        
        db.collection('posts').add({
            authorUID: user.uid,
            content: postContentRef.current.value === '' ? '' : postContentRef.current.value.replace(/\r\n|\r|\n/g, "<vinhtruong></vinhtruong>"),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            liked: {
                count: 0,
                users: [],
            },
        }).then(doc => {
            if (fileToPost) {
                const uploadTask = storage.ref(`posts/${doc.id}/${doc.id}`).putString(fileToPost, 'data_url');
                removeFile();

                uploadTask.on('state_changed', null, 
                    (error) => console.error(error),
                    () => {
                        storage.ref(`posts/${doc.id}/${doc.id}`).getDownloadURL().then(url => {
                            if (isImage(fileToPost)) {
                                db.collection('posts').doc(doc.id).set({
                                    image: url
                                }, {merge: true});
                            }
                            else {
                                db.collection('posts').doc(doc.id).set({
                                    video: url
                                }, {merge: true});
                            }
                        })
                    }
                )
            }

            db.doc(`users/${user.uid}`).update({
                posts: firebase.firestore.FieldValue.arrayUnion(`${doc.id}`)
            })  
        })

        postContentRef.current.value = "";
        togglePostModal();
    }

    const addfileToPost = (e) => {
        const reader = new FileReader();
        if (e.target.files.length !== 0) {
            reader.readAsDataURL(e.target.files[0]);
            setVideoURL(window.URL.createObjectURL(e.target.files[0]));
        }
        
        reader.onload = (readerEvent) => {
            setFileToPost(readerEvent.target.result)
        }

        postContentChange(e)
    }

    const removeFile = () => {
        setFileToPost(null);
        setVideoURL("");
        
        if (postContentRef.current.value === '') {
            submitBtnRef.current.classList.add('bg-gray-300');
            submitBtnRef.current.classList.add('cursor-not-allowed');
            submitBtnRef.current.classList.add('pointer-events-none');
        }
    }

    const togglePostModal = () => {
        dispatch({ 
            type: actionTypes.TOGGLE_POSTMODAL,
            postModalStatus: !postModalStatus, 
        })

        postContentRef.current.value = "";
        removeFile();
    }

    const postContentChange = (e) => {
        let check = e.target.value === ''
        submitBtnRef.current.classList.toggle('bg-gray-300', check);
        submitBtnRef.current.classList.toggle('cursor-not-allowed', check);
        submitBtnRef.current.classList.toggle('pointer-events-none', check);
    }

    return (
        <div className="w-full">
            <div className="bg-white min-h-32 rounded-xl shadow-md my-5">
                {/* Top */}
                <div className="flex items-center justify-center space-x-2 py-3 mx-4 border-b border-gray-200">
                    <Avatar src={ user.photoURL } />

                    <button 
                        onClick={ togglePostModal } className="flex-1 mr-3 bg-gray-200 py-3 px-4 rounded-full text-left text-gray-400"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                        {name && user.uid !== uid ? `Vi???t g?? ???? cho ${name}` : `${user.displayName?.split(' ').pop()} ??i, b???n ??ang ngh?? g?? th???`} 
                    </button>
                </div>

                {/* More Feature */}
                <div className="flex items-center justify-around py-2">
                    <div 
                        onClick={ () => {
                            togglePostModal();
                            filePickerRef.current.click();
                        } }
                        className="flex space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-xl"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                        <Image
                            src="/images/photo.png" 
                            width={23}
                            height={23}
                            layout="fixed"
                        />
                        <p className="text-gray-400">???nh/Video</p>
                    </div>
                    <div 
                        className="flex space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-xl"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                        <Image
                            src="/images/tag-friend.png" 
                            width={23}
                            height={23}
                            layout="fixed"
                        />
                        <p className="text-gray-400">Tag b???n b??</p>
                    </div>
                    <div 
                        className="flex space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-xl"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                        <Image
                            src="/images/feeling.png" 
                            width={23}
                            height={23}
                            layout="fixed"
                        />
                        <p className="text-gray-400">C???m x??c</p>
                    </div>
                </div>
            </div>

            <div className={`w-full relative ${!postModalStatus && 'hidden' }`}>
                {/* Overlay */}
                <div 
                    onClick={ togglePostModal }
                    className="fixed top-0 bottom-0 right-0 left-0 bg-black opacity-20 z-50"
                ></div>

                <form 
                    onSubmit={ postToServer } 
                    className="absolute w-full z-[60] flex flex-col bg-white min-h-[420px] sm:min-h-80 rounded-xl p-4 top-[-330px] mx-2 lg:mx-0"
                >
                    <div className="relative">
                        <h3 className="text-center font-semibold text-gray-600 pb-2 border-b border-gray-200">T???o b??i vi???t m???i</h3>
                        <div 
                            onClick={ togglePostModal }
                            className="absolute -top-2 right-0 flex items-center justify-center bg-gray-200 rounded-full w-8 h-8 cursor-pointer"
                            style={{ WebkitTapHighlightColor: "transparent" }}
                        >
                            <CloseIcon fontSize="small"/>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between flex-1 space-y-3">
                        {/* Post input */}
                        <div className="pt-3 flex space-x-5">
                            <Avatar src={ user.photoURL } />
                            <textarea 
                                onChange={ postContentChange }
                                ref={ postContentRef }
                                placeholder={name ? `Vi???t g?? ???? cho ${name}` : `${user.displayName?.split(' ').pop()} ??i, b???n ??ang ngh?? g?? th??? ?`}
                                className="outline-none resize-none flex-1 pt-2 h-52 pr-2 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent scrollbar-thumb-rounded-full"
                            ></textarea>
                        </div>

                        {/* Image */}
                        { fileToPost && 
                            <div className="relative flex h-[350px]">
                                <div className="m-auto border border-gray-300 rounded-2xl p-2 w-4/5 h-full flex">
                                    { isImage(fileToPost) ?
                                        <img src={fileToPost} className="w-full h-full rounded-2xl mx-auto"/>
                                        :
                                        <video className="w-full h-full rounded-2xl mx-auto" src={ videoURL } controls></video>
                                    }
                                </div>
                                <div 
                                    onClick={ removeFile }
                                    className="absolute top-4 right-20 flex items-center justify-center bg-gray-200 rounded-full w-8 h-8 cursor-pointer"
                                    style={{ WebkitTapHighlightColor: "transparent" }}
                                >
                                    <CloseIcon fontSize="small"/>
                                </div>
                            </div>
                        }

                        {/* More Feature */}
                        <div>
                            <div className="flex justify-center lg:justify-around items-center border boder-gray-100 rounded-md">
                                <h3 className="font-semibold hidden xl:block">Th??m v??o b??i vi???t</h3>
                                <div className="flex flex-col sm:flex-row items-center justify-around py-2">
                                    <div 
                                        onClick={ () => filePickerRef.current.click() }
                                        className="flex space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-xl"
                                        style={{ WebkitTapHighlightColor: "transparent" }}
                                    >
                                        <Image
                                            src="/images/photo.png" 
                                            width={23}
                                            height={23}
                                            layout="fixed"
                                        />
                                        <p className="text-gray-400">???nh/Video</p>
                                    </div>
                                    <div 
                                        className="flex space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-xl"
                                        style={{ WebkitTapHighlightColor: "transparent" }}
                                    >
                                        <Image
                                            src="/images/tag-friend.png" 
                                            width={23}
                                            height={23}
                                            layout="fixed"
                                        />
                                        <p className="text-gray-400">Tag b???n b??</p>
                                    </div>
                                    <div 
                                        className="flex space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-xl"
                                        style={{ WebkitTapHighlightColor: "transparent" }}
                                    >
                                        <Image
                                            src="/images/feeling.png" 
                                            width={23}
                                            height={23}
                                            layout="fixed"
                                        />
                                        <p className="text-gray-400">C???m x??c</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit btn */}
                        <div className="text-center mt-3">
                            <button 
                                ref={ submitBtnRef }
                                type="submit" 
                                className="w-full btn-primary bg-gray-300 cursor-not-allowed pointer-events-none"
                            >
                                ????ng
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        
            <input 
                ref={ filePickerRef } 
                onChange={ addfileToPost } 
                type="file" 
                accept="image/png, image/gif, image/jpeg, video/mp4,video/x-m4v,video/*"
                hidden 
            />
        </div>
    )
}

export default FeedPost
