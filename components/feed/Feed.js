import FeedPost from './posts/FeedPost';
import Posts from './posts/Posts';
import Story from './story/Story';

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
