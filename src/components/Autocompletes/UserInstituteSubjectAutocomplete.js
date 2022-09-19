import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import useDebounce from '../../hooks/useDebounce';
import { UserInstituteSubjectService } from '../../apis/rest.app';
import { useLanguage } from '../../store/LanguageStore';

function UserInstituteSubjectAutocomplete({
    label,
    helperText,
    error,
    onChange,
    onSelect,
    value = '',
    placeholder,
    searchOnEmpty,
    subject,
    ...others
}) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [key, setKey] = useState('');
    const [searchValue, setSearchValue] = useState({ name: value });
    const [onLoad, setOnLoad] = useState(false);

    const debouncedSearchTerm = useDebounce(searchValue.name);

    const Language = useLanguage();

    const onSearch = (searchValue) => {
        if (searchValue === key) {
            if (searchValue === '') {
                if (!searchOnEmpty) return true;
            } else return true;
        }
        setKey(searchValue);
        setOptions([]);
        setLoading(true);
        UserInstituteSubjectService.find({
            query: {
                teacherName: searchValue,
                ...(subject ? { subject } : {}),
            },
        }).then((response) => {
            setOptions(response);
            setLoading(false);
        });
    };

    useEffect(() => {
        if (onLoad || searchOnEmpty) {
            onSearch(searchValue && searchValue.name ? searchValue.name.trim() : '');
        } else setOnLoad(true);
    }, [debouncedSearchTerm, subject]);

    return (
        <Autocomplete
            filterSelectedOptions
            freeSolo
            getOptionLabel={(option) => {
                return option?.user?.name || '';
            }}
            onChange={(event, newValue) => onSelect(newValue ? newValue : null)}
            options={options}
            renderInput={(params) => (
                <TextField
                    error={error}
                    fullWidth
                    helperText={helperText}
                    // margin="normal"
                    label={label ? label : Language.get('autocomplete.institute.label')}
                    placeholder={placeholder ? placeholder : Language.get('autocomplete.institute.placeholder')}
                    value={value}
                    variant="outlined"
                    {...params}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
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

UserInstituteSubjectAutocomplete.propTypes = {
    id: PropTypes.string,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    handleClear: PropTypes.func,
    value: PropTypes.any,
    error: PropTypes.bool,
    searchOnEmpty: PropTypes.bool,
    helperText: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    subject: PropTypes.string,
};

UserInstituteSubjectAutocomplete.defaultProps = {
    type: 'global',
    onChange: () => {},
    onSelect: () => {},
    handleClear: () => {},
    error: false,
    searchOnEmpty: false,
    helperText: '',
};

export default UserInstituteSubjectAutocomplete;
