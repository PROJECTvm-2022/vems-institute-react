import { ChaptersService } from './rest.app';

export const getAllChapters = (skip, limit, id, search) =>
    ChaptersService.find({
        query: {
            name: {
                $regex: `.*${search}.*`,
                $options: 'i',
            },
            unit: id,
            $populate: ['unit', 'syllabus'],
            $limit: limit,
            $skip: skip,
        },
    });

export const getChaptersById = (id) => ChaptersService.get(id);

export const createChapter = (name, unit) =>
    ChaptersService.create(
        { name, unit },
        {
            query: {
                $populate: ['unit', 'syllabus'],
            },
        },
    );
export const deleteChapter = (id) => ChaptersService.remove(id);
export const editChapter = (id, name) =>
    ChaptersService.patch(
        id,
        { name },
        {
            query: {
                $populate: 'unit',
            },
        },
    );

export const switchChapter = (id, status) => ChaptersService.patch(id, { status });
