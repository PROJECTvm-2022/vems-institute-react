import React from 'react';
import Grid from '@material-ui/core/Grid';
import { fade, makeStyles } from '@material-ui/core/styles';
import { useLanguage } from '../../store/LanguageStore';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';

const useStyle = makeStyles((theme) => ({
    secondDiv: {
        marginTop: theme.spacing(3),
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
        height: 38,
        boxShadow: '0 3px 8px 0 rgba(0, 0, 0, 0.06)',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 1),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 2),
        },
        width: 260,
    },
    searchIcon: {
        padding: theme.spacing(1, 1),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
    },
    formControl: {
        marginLeft: theme.spacing(2),
    },
}));

function FilterComponentForStudent({ setSearch, setHasMore, setStudentData }) {
    const classes = useStyle();
    const Language = useLanguage();

    return (
        <Grid container spacing={0}>
            <Grid item md={12} sm={12} xs={12}>
                <Box className={classes.secondDiv} display="flex" justifyContent="space-between">
                    <Box className={classes.search} display="flex" justifyContent="space-between">
                        <InputBase
                            autoFocus
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            onChange={(e) => {

                                if(setHasMore) {
                                    setStudentData([]);
                                    setHasMore(true);
                                }
                                setSearch(e.target.value);
                            }}
                            placeholder={Language.get('student.search_student')}
                        />
                        <Box
                            alignItems="center"
                            className={classes.searchIcon}
                            display="flex"
                            justifyContent="flex-end"
                        >
                            <SearchIcon className={classes.icon} color={'primary'} />
                        </Box>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}
FilterComponentForStudent.propTypes = {
    setStudentData: PropTypes.func.isRequired,
    setSearch: PropTypes.func.isRequired,
    setHasMore: PropTypes.func.isRequired,
};

export default FilterComponentForStudent;
