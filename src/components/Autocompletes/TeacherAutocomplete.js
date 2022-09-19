import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import useDebounce from '../../hooks/useDebounce';
import { UserService } from '../../apis/rest.app';
import { useLanguage } from '../../store/LanguageStore';

function TeacherAutoComplete({
    label,
    helperText,
    error,
    onChange,
    onSelect,
    value = '',
    placeholder,
    searchOnEmpty,
    syllabusId,
    ...others
}) {
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
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
        UserService.find({
            query: {
                $skip: options.length,
                role: 8,
                name: {
                    $regex: searchValue.trim() !== '' ? `.*${searchValue}.*` : '',
                    $options: 'i',
                },
            },
        }).then((response) => {
            setOptions([...response.data]);
            setLoading(false);
        });
    };

    useEffect(() => {
        if (onLoad || searchOnEmpty) {
            onSearch(searchValue && searchValue.name ? searchValue.name.trim() : '');
        } else setOnLoad(true);
    }, [debouncedSearchTerm, searchOnEmpty]);

    return (
        <Autocomplete
            filterSelectedOptions
            freeSolo
            getOptionLabel={(option) => option?.name}
            onChange={(event, newValue) => onSelect(newValue ? newValue : null)}
            options={options}
            renderInput={(params) => (
                <TextField
                    error={error}
                    fullWidth
                    helperText={helperText}
                    // margin="normal"
                    label={label ? label : Language.get('autocomplete.teacher.label')}
                    placeholder={placeholder ? placeholder : Language.get('autocomplete.teacher.placeholder')}
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

TeacherAutoComplete.propTypes = {
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
    courseId: PropTypes.string,
    syllabusId: PropTypes.any,
};

TeacherAutoComplete.defaultProps = {
    type: 'global',
    onChange: () => {},
    onSelect: () => {},
    handleClear: () => {},
    error: false,
    searchOnEmpty: false,
    helperText: '',
};

export default TeacherAutoComplete;
