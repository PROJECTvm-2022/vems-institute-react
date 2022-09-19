import React, { useEffect } from 'react';
import { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Translate from '../../../src/components/Translate';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
// import EditIcon from '@material-ui/icons/Edit';
// import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { useLanguage } from '../../../src/store/LanguageStore';
// import Confirm from '../../../src/components/Confirm';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { CitiesService } from '../../../src/apis/rest.app';
import CityTableItem from '../../../src/page-components/city/CityTableItem';
import DialogActions from '@material-ui/core/DialogActions';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

const useStyle = makeStyles((theme) => ({
    buttonDiv: {
        fontWeight: 500,
        fontSize: 13,
    },
    switchButtonIcon: {
        marginLeft: theme.spacing(1),
        color: theme.palette.primary.main,
    },
    mainDiv: {
        marginTop: theme.spacing(3),
    },
    nextButton: {
        marginTop: theme.spacing(1),
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        padding: theme.spacing(1, 2, 1, 4),
        fontSize: 13,
        width: '100%',
    },
    search: {
        position: 'relative',
        boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.06)',
    },
    searchIcon: {
        position: 'absolute',
        pointerEvents: 'none',
    },
}));

const City = () => {
    const Router = useRouter();
    const classes = useStyle();
    const Language = useLanguage();
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [cityData, setCityData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const { id } = Router.query;
    const [search, setSearch] = useState('');

    const handleButtonOpen = () => {
        setOpenAddDialog(true);
    };
    const handleClose = () => {
        setOpenAddDialog(false);
    };

    useEffect(() => {
        setLoading(true);
        CitiesService.find({
            query: {
                state: id,
            },
        })
            .then((response) => {
                // console.log('stateData', response);
                setCityData(response);
                setLoading(false);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong!', { variant: 'error' });
                setLoading(false);
            });
    }, []);
    const validate = () => {
        if (name === '') {
            enqueueSnackbar('Enter a Name', { variant: 'warning' });
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (validate()) {
            setLoading(true);
            CitiesService.create({ name: name, state: id })
                .then((response) => {
                    let _data = response;
                    setCityData([...cityData, _data]);
                    setLoading(false);
                    enqueueSnackbar(Language.get('city.form.message.addedSuccessFully'), {
                        variant: 'success',
                    });
                    setOpenAddDialog(false);
                })
                .catch((error) => {
                    enqueueSnackbar(error.message ? error.message : 'Something went wrong!', { variant: 'error' });
                    setLoading(false);
                    setOpenAddDialog(false);
                });
        }
    };

    return (
        <>
            <Grid container spacing={0}>
                <Grid item md={12} sm={12} xs={12}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant={'h3'}>
                            <Translate>{'city.title'}</Translate>
                        </Typography>
                        <Box alignItems="center" className={classes.buttonDiv} display="flex" justifyContent="center">
                            <Button
                                color="primary"
                                disabled={loading}
                                onClick={handleButtonOpen}
                                size="large"
                                variant="contained"
                            >
                                <Translate>{'city.form.button.addState'}</Translate>
                            </Button>
                        </Box>
                    </Box>
                </Grid>
                <Box
                    bgcolor={'white'}
                    borderRadius={4}
                    className={classes.search}
                    component={Grid}
                    display={'flex'}
                    height="38"
                    item
                    justifyContent={'space-between'}
                    mb={1}
                    md={3}
                    mt={5}
                    sm={4}
                    width={170}
                    xs={6}
                >
                    <Box>
                        <Box
                            alignItems={'center'}
                            className={classes.searchIcon}
                            display={'flex'}
                            height="100%"
                            justifyContent={'flex-end'}
                            p={0.5}
                        >
                            <SearchIcon color={'primary'} />
                        </Box>
                        <InputBase
                            autoFocus
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            onChange={(e) => {
                                setSearch(e.target.value.trim());
                            }}
                            placeholder={'Enter name to search'}
                        />
                    </Box>
                </Box>
            </Grid>
            {cityData && cityData.length ? (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">
                                <Translate>{'city.form.tableHeadings.name'}</Translate>
                            </TableCell>
                            <TableCell>
                                <Translate>{'city.form.tableHeadings.status'}</Translate>
                            </TableCell>
                            <TableCell>
                                <Translate>{'city.form.tableHeadings.action'}</Translate>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cityData
                            .filter((each) => each?.name.toLowerCase().includes(search.toLowerCase()))
                            .map((each, index) => (
                                <CityTableItem
                                    cityData={cityData}
                                    each={each}
                                    key={each._id}
                                    position={index}
                                    setCityData={setCityData}
                                />
                            ))}
                    </TableBody>
                </Table>
            ) : loading ? (
                <Box alignItems={'center'} display={'flex'} justifyContent={'center'}>
                    <CircularProgress size={20} />
                </Box>
            ) : (
                <Box alignItems="center" display={'flex'} height={'60vh'} justifyContent="center">
                    <Translate>{'city.form.errors.noStatesFound'}</Translate>
                </Box>
            )}
            <Dialog fullWidth maxWidth={'xs'} onClose={handleClose} open={openAddDialog}>
                <DialogTitle onClose={handleClose}>
                    <Typography variant="h4">{'Add City'}</Typography>
                </DialogTitle>
                <DialogContent>
                    <Box pb={2}>
                        <TextField
                            autoFocus
                            error={nameError !== ''}
                            fullWidth
                            helperText={nameError}
                            label={Language.get('city.form.labels.name')}
                            margin="dense"
                            onChange={(event) => setName(event.target.value)}
                            required
                            size="small"
                            value={name}
                            variant="outlined"
                        />
                        <DialogActions>
                            <Box display={'flex'} justifyContent={'space-between'}>
                                <Button color="primary" disabled={loading} onClick={handleClose} variant="outlined">
                                    <Translate>{'city.form.button.cancel'}</Translate>
                                </Button>
                                <Button color="primary" disabled={loading} onClick={handleNext} variant="contained">
                                    {loading ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        <Translate>{'state.form.button.add'}</Translate>
                                    )}
                                </Button>
                            </Box>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};
export default City;
