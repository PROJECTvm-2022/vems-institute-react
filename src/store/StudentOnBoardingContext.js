import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useStateObject from '../hooks/useStateObject';

export const StudentOnBoardingContext = createContext([{}, (value) => value]);

StudentOnBoardingContext.displayName = 'StudentOnBoardingContext';

export const StudentOnBoardingProvider = ({ children }) => {
    const [data, setData] = useStateObject({});

    return <StudentOnBoardingContext.Provider value={[data, setData]}>{children}</StudentOnBoardingContext.Provider>;
};

StudentOnBoardingProvider.propTypes = {
    children: PropTypes.any.isRequired,
    value: PropTypes.object,
};

export const useStudentOnBoardingData = () => useContext(StudentOnBoardingContext);

export const withStudentOnBoardingData = (Component) => {
    const WithStudentOnBoardingData = () => (
        <StudentOnBoardingProvider>
            <Component />
        </StudentOnBoardingProvider>
    );

    if (typeof Component.layout !== 'undefined') WithStudentOnBoardingData.layout = Component.layout;
    return WithStudentOnBoardingData;
};
