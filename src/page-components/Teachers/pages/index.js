import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// import Link from '../src/components/Link';
import Image from '../public/404.svg';
import { makeStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';

const useStyle = makeStyles(() => ({
    image: {
        height: '100%',
        width: '-webkit-fill-available',
        marginBottom: 40,
        marginTop: 40,
    },
    imageInMd: {
        height: 'auto',
        width: '50%',
        marginBottom: 10,
    },
}));

export default function Index() {
    const classes = useStyle();

    return (
        <>
            {/*<Box my={4}>*/}
            {/*    <Typography component="h1" gutterBottom variant="h4">*/}
            {/*        Next.js example*/}
            {/*    </Typography>*/}
            {/*    <Link color="secondary" href="/about">*/}
            {/*        Go to the about page*/}
            {/*    </Link>*/}
            {/*</Box>*/}
            <Hidden xsDown>
                <Box alignItems={'center'} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                    <img alt={'image'} className={classes.imageInMd} src={Image} />
                    <Box
                        alignItems={'center'}
                        component={Typography}
                        display={'flex'}
                        justifyContent={'center'}
                        mt={6}
                        variant={'h1'}
                    >
                        {'Coming Soon'}
                    </Box>
                    <Box
                        alignItems={'center'}
                        component={Typography}
                        display={'flex'}
                        justifyContent={'center'}
                        mt={2}
                        variant={'h3'}
                    >
                        {'This page is under construction ! It will be available soon.'}
                    </Box>
                </Box>
            </Hidden>
            <Hidden smUp>
                <Box alignItems={'center'} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                    <img alt={'image'} className={classes.image} src={Image} />
                    <Box
                        alignItems={'center'}
                        component={Typography}
                        display={'flex'}
                        justifyContent={'center'}
                        mt={3}
                        variant={'h2'}
                    >
                        {'Coming Soon'}
                    </Box>
                    <Box
                        alignItems={'center'}
                        component={Typography}
                        display={'flex'}
                        justifyContent={'center'}
                        mt={1}
                        variant={'h5'}
                    >
                        {'This page is under construction ! It will be available soon.'}
                    </Box>
                </Box>
            </Hidden>
        </>
    );
}
