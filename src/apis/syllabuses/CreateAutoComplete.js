/**
 *
 * @createdBy Surya Shakti
 * @email suryashakti1999@gmail.com
 * @description create and edit autoComplete
 * @createdOn 02-Jan-21 11:06 AM
 */

import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

const CreateAutocomplete = ({ list, value, setValue, search, setSearch, label }) => {
    return (
        <React.Fragment>
            <Autocomplete
                fullWidth
                getOptionLabel={(option) => (option && option.name ? option.name : '')}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                options={list}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        margin={'dense'}
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        variant="outlined"
                    />
                )}
                value={value}
            />
        </React.Fragment>
    );
};

CreateAutocomplete.propTypes = {
    list: PropTypes.array,
    value: PropTypes.any,
    setValue: PropTypes.any,
    search: PropTypes.any,
    setSearch: PropTypes.any,
    label: PropTypes.any,
};

export default CreateAutocomplete;
