import Link from 'next/link';
import { db } from '../../../../firebase';
import firebase from 'firebase';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useStateValue } from '../../../common/StateProvider';
import { makeStyles } from '@material-ui/core/styles';

// Icons
import { Avatar } from '@material-ui/core';

function FriendRequest({ uid }) {
    const [{ user }] = useStateValue();
    const useStyles = makeStyles((theme) => ({
        large: {
          width: theme.spacing(7),
          height: theme.spacing(7),
        },
    }));

    const classes = useStyles();
    const [userInfo] = useDocument(
        db.doc(`users/${uid}`)
    )

    const acceptRequest = () => {
        db.doc(`users/${user.uid}`).set({
            friends: firebase.firestore.FieldValue.arrayUnion(`${uid}`),
            friendRequestsPending: firebase.firestore.FieldValue.arrayRemove(`${uid}`)
        }, {merge: true})

        db.doc(`users/${uid}`).set({
            friends: firebase.firestore.FieldValue.arrayUnion(`${user.uid}`),
            friendRequestsSent: firebase.firestore.FieldValue.arrayRemove(`${user.uid}`)
        }, {merge: true})
    }

    const declineRequest = () => {
        db.doc(`users/${user.uid}`).set({
            friendRequestsPending: firebase.firestore.FieldValue.arrayRemove(`${uid}`)
        }, {merge: true})

        db.doc(`users/${uid}`).set({
            friendRequestsSent: firebase.firestore.FieldValue.arrayRemove(`${user.uid}`)
        }, {merge: true})
    }

    return (
        <div className="flex space-x-3 items-center">
            <div className="cursor-pointer">
                <Link href={`/profile/${uid}`}>
                    <Avatar src={ userInfo?.data().photoURL ||  ''} className={classes.large}/>
                </Link>
            </div>

            <div className="space-y-2">
                <Link href={`/profile/${uid}`}>
                    <div className="font-semibold text-gray-500 cursor-pointer hover:underline">{ userInfo?.data().displayName }</div>
                </Link>
                <div className="flex space-x-3">
                    <button onClick={ acceptRequest } className="btn-primary py-1 px-2">
                        Chấp nhận
                    </button>
                    <button onClick={ declineRequest } className="btn-cancel text-black py-1 px-2">
                        Từ chối
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FriendRequest
