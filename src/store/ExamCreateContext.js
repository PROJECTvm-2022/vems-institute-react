import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useStateObject from '../hooks/useStateObject';

export const ExamCreateContext = createContext([{}, (value) => value]);

ExamCreateContext.displayName = 'ExamCreateContext';

export const ExamCreateProvider = ({ children }) => {
    const [state, setState] = useStateObject({});

    return <ExamCreateContext.Provider value={[state, setState]}>{children}</ExamCreateContext.Provider>;
};

ExamCreateProvider.propTypes = {
    children: PropTypes.any.isRequired,
    value: PropTypes.object,
};

export const useExamCreateData = () => useContext(ExamCreateContext);

export const withExamCreateData = (Component) => {
    const WithExamCreateData = () => (
        <ExamCreateProvider>
            <Component />
        </ExamCreateProvider>
    );

    if (typeof Component.layout !== 'undefined') WithExamCreateData.layout = Component.layout;
    return WithExamCreateData;
};
