import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useStateObject from '../hooks/useStateObject';

export const InstitutionDetailsContext = createContext([{}, (value) => value]);

InstitutionDetailsContext.displayName = 'InstitutionDetailsContext';

export const InstitutionDetailsProvider = ({ children }) => {
    const [state, setState] = useStateObject({});

    return (
        <InstitutionDetailsContext.Provider value={[state, setState]}>{children}</InstitutionDetailsContext.Provider>
    );
};

InstitutionDetailsProvider.propTypes = {
    children: PropTypes.any.isRequired,
    value: PropTypes.object,
};

export const useInstituteDetailsData = () => useContext(InstitutionDetailsContext);

export const withInstituteDetailsData = (Component) => {
    const WithInstituteDetailsData = () => (
        <InstitutionDetailsProvider>
            <Component />
        </InstitutionDetailsProvider>
    );

    if (typeof Component.layout !== 'undefined') WithInstituteDetailsData.layout = Component.layout;
    return WithInstituteDetailsData;
};
