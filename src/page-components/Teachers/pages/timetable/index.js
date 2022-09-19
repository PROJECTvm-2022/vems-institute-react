import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyle = makeStyles((theme) => ({
    buttonDiv: {
        fontWeight: 500,
        fontSize: 13,
    },
}));

const TimeTable = () => {
    const classes = useStyle();

    return <>Demo</>;
};

export default TimeTable;
