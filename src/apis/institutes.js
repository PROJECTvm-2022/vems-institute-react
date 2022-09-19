import { CourseService, InstituteService, SubjectsService } from './rest.app';

export const getAllInstitute = (skip, extraQuery = {}) =>
    InstituteService.find({
        query: {
            $skip: skip,
            $limit: 9,
            ...extraQuery,
            $populate: 'user',
        },
    });

export const createInstitute = (body) => InstituteService.create(body);

export const editInstitute = (id, body) => InstituteService.patch(id, body);

export const deleteInstitute = (id) => InstituteService.remove(id);

export const getAllCourses = (skip = 0, extraQuery = {}) =>
    CourseService.find({
        query: {
            $skip: skip,
            ...extraQuery,
        },
    });
export const getAllSubjects = (skip = 0, extraQuery = {}) =>
    SubjectsService.find({
        query: {
            $skip: skip,
            ...extraQuery,
        },
    });

export const getAllInstitutes = (skip, limit, search) =>
    InstituteService.find({
        query: {
            name: {
                $regex: `.*${search}.*`,
                $options: 'i',
            },
            $limit: limit,
            $skip: skip,
        },
    });

export const getInstituteDetail = (id) => InstituteService.get(id);
export const getAllCoursesOfInstitute = (institute) =>
    CourseService.find({
        query: {
            $skip: 0,
            $limit: 4,
            institute,
        },
    });
