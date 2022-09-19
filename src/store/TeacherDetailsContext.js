import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useStateObject from '../hooks/useStateObject';

export const TeacherDetailsContext = createContext([{}, (value) => value]);

TeacherDetailsContext.displayName = 'TeacherDetailsContext';

export const TeacherDetailsProvider = ({ children }) => {
    const [state, setState] = useStateObject({});

    return <TeacherDetailsContext.Provider value={[state, setState]}>{children}</TeacherDetailsContext.Provider>;
};

TeacherDetailsProvider.propTypes = {
    children: PropTypes.any.isRequired,
    value: PropTypes.object,
};

export const useTeacherDetailsData = () => useContext(TeacherDetailsContext);

export const withTeacherDetailsData = (Component) => {
    const WithTeacherDetailsData = () => (
        <TeacherDetailsProvider>
            <Component />
        </TeacherDetailsProvider>
    );

    if (typeof Component.layout !== 'undefined') WithTeacherDetailsData.layout = Component.layout;
    return WithTeacherDetailsData;
};
