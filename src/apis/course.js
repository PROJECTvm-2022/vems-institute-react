import { CourseService, InstituteCourse } from './rest.app';

export const getAllCourses = (skip, limit, search) =>
    CourseService.find({
        query: {
            name: {
                $regex: `.*${search}.*`,
                $options: 'i',
            },
            $limit: limit,
            $skip: skip,
        },
    });

export const getAllCoursesOfInstitutes = (skip, limit, search, institute) =>
    InstituteCourse.find({
        query: {
            name: {
                $regex: `.*${search}.*`,
                $options: 'i',
            },
            $limit: limit,
            $skip: skip,
            institute: institute,
            $populate: ['course'],
        },
    });

export const getCourseById = (id) => CourseService.get(id);

export const createCourse = (name, avatar, commission, maxPrice) =>
    CourseService.create({ name, avatar, commission, maxPrice });

export const deleteCourses = (id) => CourseService.remove(id);

export const editCourse = (id, name, avatar, commission, maxPrice) =>
    CourseService.patch(id, { name, avatar, commission, maxPrice });

export const switchCourse = (id, status) => CourseService.patch(id, { status });
