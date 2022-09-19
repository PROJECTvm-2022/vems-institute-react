import { TopicsService } from './rest.app';

export const getAllTopic = (skip, limit, id, search) =>
    TopicsService.find({
        query: {
            name: {
                $regex: `.*${search}.*`,
                $options: 'i',
            },
            chapter: id,
            $populate: ['chapter', 'unit', 'syllabus'],
            $limit: limit,
            $skip: skip,
        },
    });

export const createTopic = (name, chapter) =>
    TopicsService.create(
        { name, chapter },
        {
            query: {
                $populate: ['chapter', 'unit', 'syllabus'],
            },
        },
    );
export const deleteTopic = (id) => TopicsService.remove(id);
export const editTopic = (id, name) =>
    TopicsService.patch(
        id,
        { name },
        {
            query: {
                $populate: ['chapter', 'unit', 'syllabus'],
            },
        },
    );

export const switchTopic = (id, status) => TopicsService.patch(id, { status });
