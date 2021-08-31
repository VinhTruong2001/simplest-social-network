import { useDocument } from "react-firebase-hooks/firestore";
import { db } from '../../firebase';
import Post from '../../components/feed/posts/Post';
import Head  from 'next/head';

function PostPage({ path }) {
    const [post] = useDocument(
        db.doc(`posts/${path.id}`)
    )

    console.log(post)
    return (<>
        <Head>
            <title>{post ? 'Simplest' : 'Đang tải...' }</title>
            <link rel="icon" href="/favicon.png" />
        </Head>

        <div className="px-2 xl:px-[450px] mt-5">
            { post &&
                <Post 
                    key={ post.id }
                    id={ post.id }
                    authorUID={ post.data().authorUID }
                    content={ post.data().content }
                    timestamp={ post.data().timestamp }
                    image={ post.data().image }
                    video={ post.data().video }
                    activity={ post.data().activity }
                    liked={ post.data().liked }
                    openComment={ true }
                />
            }
        </div>
    </>)
}

export async function getStaticPaths() {
    const data = await db.collection('posts').get().then(result => result);;
    
    const paths = data.docs.map(doc => {
        return {
            params: { id: doc.id.toString() }
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

export default PostPage
