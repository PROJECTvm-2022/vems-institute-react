import { SubjectsService } from './rest.app';

export const getAllSubjects = (skip, limit, search) =>
    SubjectsService.find({
        query: {
            name: {
                $regex: `.*${search}.*`,
                $options: 'i',
            },
            $limit: limit,
            $skip: skip,
        },
    });

export const getAllSubjectByCourseId = (skip, limit, id, search) =>
    SubjectsService.find({
        query: {
            course: id,
            name: {
                $regex: `.*${search}.*`,
                $options: 'i',
            },
            $populate: 'course',
            $limit: limit,
            $skip: skip,
        },
    });

export const createSubject = (name, avatar) => SubjectsService.create({ name, avatar });
export const deleteSubject = (id) => SubjectsService.remove(id);
export const EditSubject = (id, name, avatar) => SubjectsService.patch(id, { name, avatar });
export const switchSubject = (id, status) => SubjectsService.patch(id, { status });
