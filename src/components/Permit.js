import React from 'react';
import { useUser } from '../store/UserContext';
import CheckPermit from '../utils/CheckPermit';
import { ADMIN, PARENT, STUDENT, TEACHER } from '../constants/Roles';
import PropTypes from 'prop-types';

const Permit = ({ children, roles, strict }) => {
    const [user] = useUser();

    // const access = user.institutes[0];
    // if (roles === TEACHER) access = user.institutes[0];

    if (!CheckPermit(user, strict, ...(Array.isArray(roles) ? roles : [roles]))) return '';

    return <React.Fragment>{children}</React.Fragment>;
};

// const propTypes = {
//     children: PropTypes.any.isRequired,
//     roles: PropTypes.oneOf([PropTypes.array, PropTypes.string]),
//     strict: PropTypes.bool,
// };

// Permit.propTypes = propTypes;

Permit.STUDENT = (props) => <Permit {...props} roles={STUDENT} />;
Permit.TEACHER = (props) => <Permit {...props} roles={TEACHER} />;
Permit.PARENT = (props) => <Permit {...props} roles={PARENT} />;
Permit.ADMIN = (props) => <Permit {...props} roles={ADMIN} />;

// Permit.STUDENT.propTypes = propTypes;
// Permit.TEACHER.propTypes = propTypes;
// Permit.PARENT.propTypes = propTypes;
// Permit.ADMIN.propTypes = propTypes;

Permit.defaultProps = {
    strict: false,
};

export default Permit;
