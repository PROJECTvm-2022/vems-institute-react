import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import loadingImage from '../../../public/vemsLogo.jpg';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyle = makeStyles(() => ({
    root: {
        width: '22%',
        marginTop: 50,
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    img: {
        height: '10rem',
        marginTop: 140,
    },
}));
const Loader = () => {
    const classes = useStyle();

    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    return 0;
                }
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
        }, 100);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <>
            <div className={classes.logo}>
                <img alt="logo" className={classes.img} src={loadingImage} />
                <div className={classes.root}>
                    <LinearProgress value={progress} variant="determinate" />
                </div>
            </div>
        </>
    );
};

export default Loader;
