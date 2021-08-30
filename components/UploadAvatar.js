import { Avatar } from "@material-ui/core";
import { useRef, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useStateValue } from '../components/common/StateProvider';
import { actionTypes } from '../components/common/reducer';
import { auth, db, storage } from '../firebase'
import firebase from 'firebase'

// icons
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';

function UploadAvatar() {
    const useStyles = makeStyles((theme) => ({
        root: {
          display: 'flex',
          '& > *': {
            margin: theme.spacing(1),
          },
        },
        extraLarge: {
          width: theme.spacing(30),
          height: theme.spacing(30),
        },
    }));
      
    const classes = useStyles();

    const [{ user, isChangeAvatar }, dispatch] = useStateValue();
    const [avatar, setAvatar] = useState(null);
    const filePickerRef = useRef("");
    const postContentRef = useRef("");

    const uploadAvatarFile = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        
        reader.onload = (readerEvent) => {
            setAvatar(readerEvent.target.result)
        }
    }

    const removeAvatarFile = () => {
        setAvatar(null);
    }

    const uploadToServer = (e) => {
        e.preventDefault();
        const userServer = auth.currentUser;

        // Upload Avatar to storage
        const uploadAvatar = new Promise((resolve, reject) => {
            if (avatar) {
                const storageRef = storage.ref(`users/${userServer.uid}`);
                const uploadTask = storageRef.putString(avatar, 'data_url');

                uploadTask.on('state_changed', null, 
                    (error) => console.error(error),
                    () => {
                        storageRef.getDownloadURL().then(url => {
                            userServer.updateProfile({
                                photoURL: url,
                            }).then(() => {
                                console.log("Success")
                                resolve();
                            }).catch((error) => {
                                console.log(error.message);
                            });  
                        })
                    }
                )
            }
        })

        // Create a post
        uploadAvatar.then(() => {
            db.collection('posts').add({
                name: userServer.displayName,
                profilePic: userServer.photoURL,
                content: postContentRef.current.value === '' ? '' : postContentRef.current.value.replace(/\r\n|\r|\n/g, "<vinhtruong></vinhtruong>"),
                activity: "đã cập nhật ảnh đại diện",
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(doc => {
                if (avatar) {
                    const uploadTask = storage.ref(`posts/${doc.id}`).putString(avatar, 'data_url');
    
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

                toggleUploadAvatar();
            })
        })
    }

    const toggleUploadAvatar = () => {
        const user = auth.currentUser;
        dispatch({
            type: actionTypes.CHANGE_AVATAR,
            isChangeAvatar: !isChangeAvatar,
            user,
        })

        removeAvatarFile();
    }

    return (
        <div className="bg-white h-[560px] w-full mx-4 lg:mx-0 lg:w-1/3 z-[70]">
            <form onSubmit={ uploadToServer } className="mt-3 flex flex-col">
                <h3 className="font-bold text-xl text-center text-gray-600 py-3 border-b border-gray-200">
                    Cập nhật ảnh đại diện
                </h3>
                <div className="w-full px-3 flex-1 flex flex-col space-y-4 items-center justify-center pt-4 pb-12 border-b border-gray-300">
                    <textarea 
                        ref={ postContentRef }
                        placeholder="Mô tả"
                        className="outline-none resize-none w-full p-2 h-28 border rounded-xl border-gray-300 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent scrollbar-thumb-rounded-full"
                    ></textarea>
                    <div className="relative">
                        <Avatar src={ avatar || user.photoURL || '' } className={ `${classes.extraLarge} shadow-md`}/>
                        <div
                            onClick={ () => filePickerRef.current.click() } 
                            className="absolute bottom-0 right-4 bg-gray-200 rounded-full p-2 cursor-pointer"
                        >
                            <AddAPhotoIcon fontSize="large" className="text-gray-600"/>
                        </div>
                        <input 
                            ref={ filePickerRef } 
                            onChange={ uploadAvatarFile } 
                            type="file" 
                            accept="image/png, image/gif, image/jpeg"
                            hidden 
                        />
                    </div>
                </div>
                <div className="self-end mt-3 mr-3 flex space-x-3">
                    <button onClick={ toggleUploadAvatar } className="btn-primary py-2 px-4 bg-white text-blue-400 border border-blue-400">Hủy</button>
                    <button type="submit" className="btn-primary py-2 px-4">Lưu</button>
                </div> 
            </form>
        </div>
    )
}

export default UploadAvatar
