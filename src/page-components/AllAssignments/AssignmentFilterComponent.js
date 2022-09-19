import React, { useState } from 'react';
import { MenuItem, Typography } from '@material-ui/core/index';
import Grid from '@material-ui/core/Grid';
import { fade, makeStyles } from '@material-ui/core/styles';
import Translate from '../../components/Translate';
import { useLanguage } from '../../store/LanguageStore';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '../../components/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Hidden from '@material-ui/core/Hidden';
import CourseAutoComplete from '../../components/CourseAutoComplete';
import SubjectAutocomplete from '../../components/Autocompletes/SubjectAutocomplete';
import CourseAutocomplete from '../../components/Autocompletes/CourseAutocomplete';

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: theme.shape.borderRadius,
        position: 'relative',
        backgroundColor: theme.palette.background.common,
        fontSize: 12,
        color: theme.palette.common.drawer,
        padding: '4px 10px 4px 10px',
        transition: theme.transitions.create(['box-shadow']),
    },
}))(InputBase);

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
    buttonDiv: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 500,
        fontSize: 13,
        marginRight: theme.spacing(1),
    },
    switchButtonIcon: {
        marginLeft: theme.spacing(1),
        color: theme.palette.primary.main,
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
        width: '250px',
        [theme.breakpoints.down('sm')]: {
            marginLeft: theme.spacing(0),
            // margin: theme.spacing(0.5),
            width: '100%',
            maxWidth: '800px',
        },
    },
    mainSearchIcon: {
        color: theme.palette.primary.main,
    },
    mainDiv: {
        marginTop: theme.spacing(3),
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
}));

function AssignmentFilterComponent({ setSearch, setHasMore, setAllExams, setSyllabus, course, setCourse }) {
    const classes = useStyle();
    const Language = useLanguage('all-exams');

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
                            placeholder={Language.get('Search')}
                        />
                        <div className={classes.searchIcon}>
                            <SearchIcon color={'primary'} />
                        </div>
                    </div>
                    <Box alignItems={'center'} className={classes.filterDiv} display={'flex'}>
                        <Typography variant={'subtitle2'}>
                            <Translate>{'Filter By'}</Translate>
                        </Typography>
                        <FormControl className={classes.formControl}>
                            <CourseAutoComplete
                                label={'Course'}
                                onSelect={(ev) => setCourse(ev || null)}
                                size="small"
                            />
                        </FormControl>
                        {course !== '' && (
                            <FormControl className={classes.formControl}>
                                <SubjectAutocomplete
                                    autoFocus
                                    className={classes.searchField}
                                    courseId={course?._id}
                                    onSelect={(ev) => {
                                        setAllExams([]);
                                        setHasMore(false);
                                        setSyllabus(ev || null);
                                        setHasMore(true);
                                    }}
                                    size="small"
                                />
                            </FormControl>
                        )}
                    </Box>
                </div>
            </Grid>
        </Grid>
    );
}
AssignmentFilterComponent.propTypes = {
    setAllExams: PropTypes.any,
    setSearch: PropTypes.any.isRequired,
    setHasMore: PropTypes.any.isRequired,
    setSyllabus: PropTypes.any.isRequired,
};

export default AssignmentFilterComponent;
