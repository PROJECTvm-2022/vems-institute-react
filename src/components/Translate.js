import React from 'react';
import PropTypes from 'prop-types';
import { useLanguage } from '../store/LanguageStore';

const Translate = ({ children, data, root }) => {
    const Language = useLanguage(root);

    return <React.Fragment>{Language.get(children, data)}</React.Fragment>;
};

Translate.propTypes = {
    children: PropTypes.string.isRequired,
    data: PropTypes.object,
    root: PropTypes.string,
};

Translate.defaultProps = {
    data: undefined,
    root: undefined,
};

export default Translate;
