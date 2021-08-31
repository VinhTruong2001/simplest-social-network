import { useState, useRef } from 'react';
import { useDocument } from 'react-firebase-hooks/firestore'
import { useStateValue } from '../common/StateProvider';
import { actionTypes } from '../common/reducer'
import { auth, db, storage } from '../../firebase'
import firebase from 'firebase'

// icons
import { Avatar, makeStyles } from '@material-ui/core';
import AddAPhotoOutlinedIcon from '@material-ui/icons/AddAPhotoOutlined';
import CameraAltIcon from '@material-ui/icons/CameraAlt';


function ProfileHeader({ uid }) {
    const useStyles = makeStyles((theme) => ({
        large: {
            [theme.breakpoints.up('md')]: {
                width: theme.spacing(23),
                height: theme.spacing(23),
            },
            [theme.breakpoints.down('sm')]: {
                width: theme.spacing(15),
                height: theme.spacing(15),
            },
        },
    }));
      
    const classes = useStyles();

    const [userInfo] = useDocument(
        db.doc(`users/${uid}`)
    )

    const [{ user }, dispatch] = useStateValue();
    const [coverImgModalState, setCoverImgModalState] = useState(false);
    const [coverImgToPost, setCoverImgToPost] = useState(null);
    const filePickerRef = useRef("");
    
    const toggleChangeAvatar = () => {
        dispatch({ 
            type: actionTypes.TOGGLE_CHANGE_AVATAR,
            isChangeAvatar: true,
        })
    }

    const uploadCoverImgFile = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        
        reader.onload = (readerEvent) => {
            setCoverImgToPost(readerEvent.target.result)
            setCoverImgModalState(true);
        }
    }

    const removeCoverImgFile = () => {
        setCoverImgToPost(null);
        setCoverImgModalState(false);
    }

    const uploadToServer = () => {
        const userServer = auth.currentUser;

        // Upload Avatar to storage
        const uploadCoverImg = new Promise((resolve, reject) => {
            if (coverImgToPost) {
                const storageRef = storage.ref(`users/${userServer.uid}/cover-img`);
                const uploadTask = storageRef.putString(coverImgToPost, 'data_url');
                removeCoverImgFile();
                
                uploadTask.on('state_changed', null, 
                    (error) => console.error(error),
                    () => {
                        storageRef.getDownloadURL().then(url => {       
                            db.collection('users').doc(`${ user.uid }`).set({
                                coverImg: url,
                            }, {merge: true})

                            dispatch({
                                type: actionTypes.SET_USER,
                                user: userServer,
                            })

                            resolve();
                        })
                    }
                )
            }
        })

        // Create a post
        uploadCoverImg.then(() => {
            db.collection('posts').add({
                authorUID: user.uid,
                content: '',
                activity: "đã thay đổi ảnh bìa",
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                liked: {
                    count: 0,
                    users: [],
                },
                comments: []
            }).then(doc => {
                if (coverImgToPost) {
                    const uploadTask = storage.ref(`posts/${doc.id}`).putString(coverImgToPost, 'data_url');
    
                    uploadTask.on('state_changed', null, 
                        (error) => console.error(error),
                        () => {
                            storage.ref(`posts/${doc.id}`).getDownloadURL().then(url => {
                                db.collection('posts').doc(doc.id).set({
                                    image: url
                                }, {merge: true});
                            })
                        }
                    )
                }

                db.doc(`users/${user.uid}`).update({
                    posts: firebase.firestore.FieldValue.arrayUnion(`${doc.id}`)
                })  
            })
        })
    }

    return (
        <div className="relative">
            <div className="absolute top-0 left-0 right-0 z-20" hidden={!coverImgModalState} >
                <div className="bg-black opacity-50 h-14 w-full rounded-t-2xl"></div>
                <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-end ỉtems-center space-x-3 px-5 py-2 z-30">
                    <button onClick={ removeCoverImgFile } className="btn-cancel text-white bg-gray-500 px-5">Hủy</button>
                    <button onClick={ uploadToServer } className="bg-[#1878f3] text-white px-5 rounded-md">Lưu</button>
                </div>
            </div>

            <div className="bg-gray-400 w-full h-[180px] lg:h-[348px] rounded-t-2xl shadow-md relative flex justify-center bg-no-repeat bg-cover bg-center" 
                style={  coverImgToPost ? { backgroundImage: `url(${coverImgToPost})` } : { backgroundImage: `url(${userInfo?.data().coverImg })` }}
            >
                <div onClick={ () => filePickerRef.current.click() } className={ `absolute right-2 xl:right-10 bottom-3 bg-white rounded-lg p-2 flex items-center text-gray-500 space-x-2 cursor-pointer ${user.uid !== uid && 'hidden'}` }>
                    <AddAPhotoOutlinedIcon fontSize={ `${window.innerWidth < 740 ? 'small' : 'medium'}` } />
                    <span className="font-semibold hidden lg:inline-block">Chỉnh sửa ảnh bìa</span>
                </div>

                <div className="absolute -bottom-5">
                    <Avatar src={ userInfo?.data().photoURL || '' } className={`border-4 border-white cursor-pointer ${ classes.large }`}/>
                    <div onClick={ toggleChangeAvatar } className={`absolute bottom-0 right-2 rounded-full p-2 bg-gray-300 cursor-pointer flex items-center ${user.uid !== uid && 'hidden'}`}>
                        <CameraAltIcon fontSize="small"/>
                    </div>
                </div>

                <input 
                    type="file" 
                    onChange={ uploadCoverImgFile }
                    ref={ filePickerRef }    
                    accept="image/png, image/gif, image/jpeg"
                    hidden
                />
            </div>

            <div className="pt-6 pb-10 text-center font-bold text-3xl border-b-2 border-gray-200 bg-transparent">
                { userInfo?.data().displayName }
            </div>
        </div> 
    )
}

export default ProfileHeader
