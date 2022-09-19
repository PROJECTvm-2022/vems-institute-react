import { UnitsService } from './rest.app';

export const getAllUnits = (skip, limit, id, search) =>
    UnitsService.find({
        query: {
            name: {
                $regex: `.*${search}.*`,
                $options: 'i',
            },
            syllabus: id,
            $populate: 'syllabus',
            $limit: limit,
            $skip: skip,
        },
    });

export const getUnitById = (id) => UnitsService.get(id);

export const createUnit = (name, syllabus) =>
    UnitsService.create(
        { name, syllabus },
        {
            query: {
                $populate: 'syllabus',
            },
        },
    );
export const deleteUnit = (id) => UnitsService.remove(id);
export const editUnit = (id, name) =>
    UnitsService.patch(
        id,
        { name },
        {
            query: {
                $populate: 'syllabus',
            },
        },
    );

export const switchUnit = (id, status) => UnitsService.patch(id, { status });
