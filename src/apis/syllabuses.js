import { SyllabusesService } from './rest.app';

export const getAllSyllabuses = (skip, limit, search) =>
    SyllabusesService.find({
        query: {
            name: {
                $regex: `.*${search}.*`,
                $options: 'i',
            },
            $populate: ['course', 'institute', 'subject', 'semester', 'specialization'],
            $limit: limit,
            $skip: skip,
        },
    });

export const getAllSyllabusesById = (skip, limit, search, id) =>
    SyllabusesService.find({
        query: {
            course: id,
            name: {
                $regex: `.*${search}.*`,
                $options: 'i',
            },
            $populate: ['course', 'institute', 'subject', 'semester', 'specialization'],
            $limit: limit,
            $skip: skip,
        },
    });

export const getSyllabusById = (id) => SyllabusesService.get(id);

export const createSyllabus = (name, course, subject) =>
    SyllabusesService.create(
        {
            name,
            course,
            subject,
        },
        {
            query: {
                $populate: ['course', 'subject'],
            },
        },
    );

export const editSyllabus = (id, name, course, subject) =>
    SyllabusesService.patch(
        id,
        {
            name,
            course,
            subject,
        },
        {
            query: {
                $populate: ['course', 'subject'],
            },
        },
    );

export const switchSyllabus = (id, status) => SyllabusesService.patch(id, { status });

export const deleteSyllabus = (id) => SyllabusesService.remove(id);

export const getAllSubjectByCourseId = (skip, limit, search, course) =>
    SyllabusesService.find({
        query: {
            name: {
                $regex: `.*${search}.*`,
                $options: 'i',
            },
            $populate: ['subject'],
            $limit: limit,
            $skip: skip,
            course: course,
        },
    });
