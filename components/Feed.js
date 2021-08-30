import FeedPost from './FeedPost';
import Posts from './Posts';
import Story from './Story';

function Feed() {
    return (
        <div className="w-full">
            {/* Story */}
            <Story />

            {/* FeedPost */}
            <FeedPost />

            {/* Post */}
            <Posts />
        </div>
    )
}

export default Feed
