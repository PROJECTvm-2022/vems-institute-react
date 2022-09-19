import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useStateObject from '../hooks/useStateObject';

export const InstituteOnBoardingContext = createContext([{}, (value) => value]);

InstituteOnBoardingContext.displayName = 'InstituteOnBoardingContext';

export const InstituteOnBoardingProvider = ({ children }) => {
    const [state, setState] = useStateObject({});

    return (
        <InstituteOnBoardingContext.Provider value={[state, setState]}>{children}</InstituteOnBoardingContext.Provider>
    );
};

InstituteOnBoardingProvider.propTypes = {
    children: PropTypes.any.isRequired,
    value: PropTypes.object,
};

export const useInstituteOnBoardingData = () => useContext(InstituteOnBoardingContext);

export const withInstituteOnBoardingData = (Component) => {
    const WithInstituteOnBoardingData = () => (
        <InstituteOnBoardingProvider>
            <Component />
        </InstituteOnBoardingProvider>
    );

    if (typeof Component.layout !== 'undefined') WithInstituteOnBoardingData.layout = Component.layout;
    return WithInstituteOnBoardingData;
};
