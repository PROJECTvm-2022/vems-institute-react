import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useStateObject from '../hooks/useStateObject';

export const StudentDetailsContext = createContext([{}, (value) => value]);

StudentDetailsContext.displayName = 'StudentDetailsContext';

export const StudentDetailsProvider = ({ children }) => {
    const [state, setState] = useStateObject({});

    return <StudentDetailsContext.Provider value={[state, setState]}>{children}</StudentDetailsContext.Provider>;
};

StudentDetailsProvider.propTypes = {
    children: PropTypes.any.isRequired,
    value: PropTypes.object,
};

export const useStudentDetailsData = () => useContext(StudentDetailsContext);

export const withStudentDetailsData = (Component) => {
    const WithStudentDetailsData = () => (
        <StudentDetailsProvider>
            <Component />
        </StudentDetailsProvider>
    );

    if (typeof Component.layout !== 'undefined') WithStudentDetailsData.layout = Component.layout;
    return WithStudentDetailsData;
};
