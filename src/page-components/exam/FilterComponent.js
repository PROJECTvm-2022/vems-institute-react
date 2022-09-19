import React from 'react';
// import { Typography } from '@material-ui/core/index';
import Grid from '@material-ui/core/Grid';
import { fade, makeStyles } from '@material-ui/core/styles';
// import Translate from '../../components/Translate';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';
// import { withStyles } from '@material-ui/styles';
// import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
// import Fab from '@material-ui/core/Fab';
// import InsertChartIcon from '@material-ui/icons/InsertChart';
// import Dialog from '@material-ui/core/Dialog';
// import DialogTitle from '../../components/DialogTitle';
// import DialogContent from '@material-ui/core/DialogContent';
// import Hidden from '@material-ui/core/Hidden';
// import CourseAutoComplete from '../../page-components/exam/CourseAutoComplete';
// import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
// import { useSnackbar } from 'notistack';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import SubjectAutocomplete from '../../components/SubjectAutocomplete';
// import TextField from '@material-ui/core/TextField';
// import { StaticDateRangePicker, AdapterDateFns, LocalizationProvider } from '@material-ui/lab';
// import StaticDateRangePicker from '@material-ui/lab/StaticDateRangePicker';
// import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
// import LocalizationProvider from '@material-ui/lab/LocalizationProvider';

// const BootstrapInput = withStyles((theme) => ({
//     root: {
//         'label + &': {
//             marginTop: theme.spacing(3),
//         },
//     },
//     input: {
//         borderRadius: theme.shape.borderRadius,
//         position: 'relative',
//         backgroundColor: theme.palette.background.common,
//         fontSize: 12,
//         color: theme.palette.common.drawer,
//         padding: '4px 10px 4px 10px',
//         transition: theme.transitions.create(['box-shadow']),
//     },
// }))(InputBase);

const useStyle = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    secondDiv: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: theme.spacing(2),
        [theme.breakpoints.down('xs')]: {
            marginTop: theme.spacing(2),
        },
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        padding: theme.spacing(1, 2, 1, 2),
        fontSize: 13,
        width: '100%',
    },
    search: {
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        height: 40,
        boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.06)',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 1),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 1),
        },
        width: 260,
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        },
    },
    searchIcon: {
        padding: theme.spacing(1, 1),
        height: '100%',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    formControl: {
        marginLeft: theme.spacing(2),
        [theme.breakpoints.down('sm')]: {
            marginLeft: theme.spacing(0),
            // margin: theme.spacing(0.5),
            width: '100%',
            maxWidth: '800px',
        },
    },
    filterDiv: {
        [theme.breakpoints.down('sm')]: {
            display: 'none',
        },
    },
    absolute: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(3),
        zIndex: 5,
    },
    searchField: {
        width: '100%',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 240,
    },
}));

function FilterComponent({ setSearch, setHasMore, setAllExams }) {
    const classes = useStyle();
    return (
        <Grid container spacing={0}>
            <Grid item md={12} sm={12} xs={12}>
                <div className={classes.secondDiv}>
                    <div className={classes.search}>
                        <InputBase
                            autoFocus
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            onChange={(e) => {
                                setAllExams([]);
                                setHasMore(true);
                                setSearch(e.target.value);
                            }}
                            placeholder={'Search Exam'}
                        />
                        <div className={classes.searchIcon}>
                            <SearchIcon color={'primary'} />
                        </div>
                    </div>
                </div>
            </Grid>
        </Grid>
    );
}
FilterComponent.propTypes = {
    setAllExams: PropTypes.any,
    setSearch: PropTypes.any.isRequired,
    setHasMore: PropTypes.any.isRequired,
};

export default FilterComponent;
