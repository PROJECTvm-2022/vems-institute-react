import { TransactionService } from './rest.app';

export const getAllTransactions = (skip, user, extraQuery = {}) =>
    TransactionService.find({
        query: {
            $skip: skip,
            institute: user,
            $limit: 10,
            ...extraQuery,
            $populate: ['institute', 'createdBy'],
        },
    });
