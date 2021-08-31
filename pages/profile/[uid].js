import Head from 'next/head'
import { useDocument } from 'react-firebase-hooks/firestore'
import { db } from '../../firebase'
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileNav from '../../components/profile/ProfileNav';
import FeedPost from '../../components/feed/posts/FeedPost';
import Posts from '../../components/feed/posts/Posts';

function Profile({ path }) {
    const [userInfo] = useDocument(
        db.doc(`users/${path.uid}`)
    )

    return (<>
        <Head>
            <title>{userInfo ? userInfo.data().displayName : 'Đang tải...' }</title>
            <link rel="icon" href="/favicon.png" />
        </Head>
        
        <div className="mt-3">
            {/* <-- Profile haeder ---> */}
            <div className="px-2 xl:px-[180px]">
                <div className="bg-white rounded-t-2xl shadow-md">
                    <ProfileHeader uid={ path.uid }/>
                </div>
            </div>

            <ProfileNav uid={path.uid}/>

            {/* Profile body */}
            <div className="flex px-2 xl:px-[180px] ">
                {/* Profile feed */}
                <div className="flex-1 md:flex-[0.6]">
                    <FeedPost name={userInfo?.data().displayName.split(' ').pop()} uid={path.uid}/>
                    <Posts uid={path.uid}/>
                </div>
            </div>
        </div>
    </>)
} 

export async function getStaticPaths() {
    const data = await db.collection('users').get().then(result => result);;
    
    const paths = data.docs.map(doc => {
        return {
            params: { uid: doc.id.toString() }
        }
    })

    return {
        paths,
        fallback: true
    }
}

export async function getStaticProps({ params }) {
    return {
        props: { 
            path: params,
        }
    }
}

export default Profile
 