import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import ImageBackground from '../../../public/background_profile.svg';
import { Avatar, Badge, Typography } from '@material-ui/core/index';
import { useInstituteDetailsData } from '../../store/InstitutionDetailsContext';
import Button from '@material-ui/core/Button';
import Translate from '../../components/Translate';
import ImageEditDialog from '../ImageEditDialog';
import CameraAltIcon from '@material-ui/icons/CameraAlt';

const useStyles = makeStyles((theme) => ({
    coverImage: {
        width: '100%',
        height: 180,
        objectFit: 'cover',
    },
    avatarProfile: {
        width: 180,
        height: 180,
        marginTop: theme.spacing(-1 * 10),
        marginLeft: theme.spacing(0.5),
        border: '3px solid white',
        background: 'white',
    },
    buttonProfile: {
        height: 45,
        minWidth: 100,
        marginLeft: theme.spacing(1),
        padding: theme.spacing(0, 2),
    },
    typoProfile: {
        textTransform: 'capitalize',
    },
}));

export default function TopHeaderProfile() {
    const [data] = useInstituteDetailsData();
    const classes = useStyles();
    const [openDialog, setOpenDialog] = useState(false);
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    return (
        <Box display="flex" flexDirection="column">
            <img alt={'background-image'} className={classes.coverImage} src={ImageBackground} />
            <Box display="flex">
                <Badge
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    badgeContent={
                        <CameraAltIcon
                            className={classes.cameraIcon}
                            onClick={handleOpenDialog}
                            style={{
                                color: data.colorCode.primary,
                            }}
                        />
                    }
                    overlap="circle"
                >
                    <Box
                        aria-label="recipe"
                        className={classes.avatarProfile}
                        component={Avatar}
                        src={data && data.logo}
                    />
                </Badge>
                {/*<Avatar className={classes.avatarProfile} src={data && data?.logo} />*/}
                <Box display="flex" mb={2} ml={2} mt={2} width="100%">
                    <Box flexGrow={1}>
                        <Typography className={classes.typoProfile} variant={'h3'}>
                            {data && data?.name}
                        </Typography>
                        <Typography className={classes.typoProfile} variant={'body2'}>
                            {data && data?.city + ', ' + data?.state}
                        </Typography>
                    </Box>
                    {/*<Button className={classes.buttonProfile} color={'primary'} variant={'contained'}>*/}
                    {/*    <Translate root={'institute/[id]'}>{'edit_profile'}</Translate>*/}
                    {/*</Button>*/}
                    <Button
                        className={classes.buttonProfile}
                        color={'secondary'}
                        href={
                            data && data.website
                                ? data.website.startsWith('http')
                                    ? data.website
                                    : 'http://' + data.website
                                : ''
                        }
                        target={'_blank'}
                        variant={'outlined'}
                    >
                        <Translate root={'institute/[id]'}>{'visit_website'}</Translate>
                    </Button>
                </Box>
            </Box>
            <ImageEditDialog each={data} openDialog={openDialog} setOpenDialog={setOpenDialog} />
        </Box>
    );
}

// TopHeaderProfile.propTypes = {
//     institute: PropTypes.object.isRequired,
// };
