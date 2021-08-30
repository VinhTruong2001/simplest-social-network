import { useStateValue } from './common/StateProvider';

// Icons
import AddIcon from '@material-ui/icons/Add';

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation"

// import Swiper core and required modules
import SwiperCore, { Navigation } from 'swiper';
import StoryCard from "./StoryCard";

// install Swiper modules
SwiperCore.use([Navigation]);

function Story() {
    const [{ user }, dispatch] = useStateValue();

    return (
        <div className="mt-7 box-border">
                <Swiper 
                    slidesPerView={3} 
                    slidesPerGroup={1} 
                    spaceBetween={8}
                    navigation={true}
                    
                    breakpoints={{
                        "740": {
                            "slidesPerView": 5,
                            "slidesPerGroup": 1
                        }
                    }}
                    className="flex items-center justify-center w-screen lg:w-full"
                >
                    <SwiperSlide>
                        <StoryCard Icon={ AddIcon } image={ user.photoURL } name={ user.displayName } />
                    </SwiperSlide>
                    <SwiperSlide>
                        <StoryCard profilePic image="/images/storyCard.jpg"/>
                    </SwiperSlide>  
                    <SwiperSlide>
                        <StoryCard profilePic image="/images/storyCard.jpg"/>
                    </SwiperSlide>
                    <SwiperSlide>
                        <StoryCard profilePic image="/images/storyCard.jpg"/>
                    </SwiperSlide>
                    <SwiperSlide>
                        <StoryCard profilePic image="/images/storyCard.jpg"/>
                    </SwiperSlide>
                    <SwiperSlide>
                        <StoryCard profilePic image="/images/storyCard.jpg"/>
                    </SwiperSlide>
                </Swiper>
        </div>
    )
}

export default Story
