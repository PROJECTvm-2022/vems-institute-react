import { ADMIN, STUDENT, SUPER_ADMIN, TEACHER } from '../constants/Roles';

const CheckPermit = (user, strict, ...roles) => {
    if (!strict && (user.role === ADMIN || user.role === SUPER_ADMIN)) return true;

    if (roles && roles.length) {
        return roles.indexOf(user.role) >= 0;
    }

    return true;
};

/**
 *
 * @param user
 * @param strict
 * @returns {{readonly SUPER_ADMIN: boolean, readonly ADMIN: boolean, readonly TEACHER: boolean, readonly STUDENT: boolean}}
 * @constructor
 */
export const CheckUser = (user, strict = false) =>
    new (class {
        get SUPER_ADMIN() {
            return CheckPermit(user, strict, SUPER_ADMIN);
        }

        get ADMIN() {
            return CheckPermit(user, strict, ADMIN);
        }

        get STUDENT() {
            return CheckPermit(user, strict, STUDENT);
        }

        get TEACHER() {
            return CheckPermit(user, strict, TEACHER);
        }
    })();

export default CheckPermit;
