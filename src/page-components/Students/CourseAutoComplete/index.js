import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import useDebounce from '../../../hooks/useDebounce';
import { InstituteCoursesService } from '../../../apis/rest.app';

function CourseAutoComplete({
    setStudentData,
    setHasMore,
    label,
    helperText,
    error,
    onChange,
    onSelect,
    value = '',
    institute,
    ...others
}) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [key, setKey] = useState('');
    const [searchValue, setSearchValue] = useState({ name: value });
    const [onLoad, setOnLoad] = useState(false);

    const debouncedSearchTerm = useDebounce(searchValue.name);

    const onSearch = (searchValue) => {
        if (searchValue === key) return true;
        setKey(searchValue);
        setOptions([]);
        setLoading(true);
        InstituteCoursesService.find({
            query: {
                name: {
                    $regex: `.*${searchValue}.*`,
                    $options: 'i',
                },
                institute: institute,
                $skip: options?.length,
                $limit: 50,
                $populate: 'course',
            },
        })
            .then((response) => {
                setOptions([...response.data]);
                setLoading(false);
            })
            .catch(() => {
                // console.log('error', error);
            });
    };

    useEffect(() => {
        InstituteCoursesService.find({
            query: {
                institute: institute,
                $skip: 0,
                $limit: 10,
                $populate: 'course',
            },
        })
            .then((response) => {
                setOptions([...response.data]);
                setLoading(false);
            })
            .catch(() => {
                // console.log('error', error);
            });
    }, []);

    useEffect(() => {
        if (onLoad) {
            onSearch(searchValue && searchValue.name ? searchValue.name.trim() : '');
        } else setOnLoad(true);
    }, [debouncedSearchTerm]);

    return (
        <Autocomplete
            filterSelectedOptions
            freeSolo
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
                if (newValue) {
                    onSelect(newValue ? newValue : null);
                    setStudentData([]);
                    setHasMore(true);
                }
            }}
            options={options}
            renderInput={(params) => (
                <TextField
                    error={error}
                    fullWidth
                    helperText={helperText}
                    label={label}
                    margin="dense"
                    style={{ width: 200 }}
                    value={value}
                    variant="outlined"
                    {...params}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>{loading ? <CircularProgress size={20} /> : null}</React.Fragment>
                        ),
                    }}
                    onChange={(event) => {
                        const _searchInput = event && event.target && event.target.value ? event.target.value : '';
                        setSearchValue({ name: _searchInput });
                        onChange(event);
                    }}
                />
            )}
            value={searchValue}
            {...others}
        />
    );
}

CourseAutoComplete.propTypes = {
    id: PropTypes.string,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    value: PropTypes.any,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    label: PropTypes.any,
    institute: PropTypes.any,
    setStudentData: PropTypes.any,
    setHasMore: PropTypes.any,
};

CourseAutoComplete.defaultProps = {
    type: 'global',
    onChange: () => {},
    onSelect: () => {},
    error: false,
    helperText: '',
    label: 'Vendor',
    institute: null,
};

export default CourseAutoComplete;
