import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

function StoryCard({ Icon, profilePic, name, image }) {
    const useStyles = makeStyles((theme) => ({
        small: {
          width: theme.spacing(4),
          height: theme.spacing(4),
        },
    }));
      
    const classes = useStyles();

    return (
        <div 
            className="relative h-40 w-full rounded-xl cursor-pointer bg-no-repeat bg-cover bg-center shadow-inner"
            style={{ backgroundImage: `url(${ image })`}}
        >
            <div className="absolute top-0 bottom-0 left-0 right-0 z-20">
                {Icon && 
                    <div className="absolute top-2 left-2 rounded-full bg-white p-1">
                        <Icon className="text-gray-400"/>
                    </div>
                }
                {profilePic && 
                    <div className="absolute top-2 left-2 border-2 border-white rounded-full">
                        <Avatar className={classes.small}/>
                    </div>
                }
                <p className="text-white ml-2 absolute bottom-3 font-semibold">{ name }</p>
            </div>
            <div className="absolute top-0 bottom-0 left-0 right-0 bg-black opacity-10 z-10 rounded-xl"></div>
        </div>
    )
}

export default StoryCard
