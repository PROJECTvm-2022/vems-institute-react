import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import useDebounce from '../../hooks/useDebounce';
import { SpecializationService } from '../../apis/rest.app';

function SpecializationAutoComplete({
    label,
    helperText,
    error,
    onChange,
    onSelect,
    institute,
    course,
    value = '',
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
        SpecializationService.find({
            query: {
                name: {
                    $regex: `.*${searchValue}.*`,
                    $options: 'i',
                },
                course: course,
                // institute: institute,
            },
        })
            .then((response) => {
                setOptions([...response.data]);
                setLoading(false);
            })
            .catch((error) => {
                // console.log('error', error);
                setLoading(false);
            });
    };

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

SpecializationAutoComplete.propTypes = {
    id: PropTypes.string,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    value: PropTypes.any,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    label: PropTypes.any,
    course: PropTypes.any,
    institute: PropTypes.any,
};

SpecializationAutoComplete.defaultProps = {
    type: 'global',
    onChange: () => {},
    onSelect: () => {},
    error: false,
    course: null,
    institute: null,
    helperText: '',
    label: 'Vendor',
};

export default SpecializationAutoComplete;
