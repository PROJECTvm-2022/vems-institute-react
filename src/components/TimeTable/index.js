import React, { useEffect } from 'react';
// import 'timetable.js/dist/styles/timetablejs.css';
// import './plugin.sass';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyle = makeStyles(() => ({
    pointer: {
        cursor: 'pointer',
    },
}));

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TimeTable = ({ list, onClick }) => {
    const classes = useStyle();

    const load = async () => {
        // if (!list.length) return;
        const Timetable = (await import('../../utils/TimeTable')).default;
        const syncScrollInit = (await import('../../utils/TimeTable')).syncScrollInit;
        const timetable = new Timetable();
        const newList = list.sort(function (a, b) {
            return a.startTime - b.startTime;
        });
        const start = list.length && Math.floor(newList[0].startTime / 60);
        const end = list.length && Math.ceil(newList[newList.length - 1].endTime / 60);
        timetable.setScope(start < 6 ? start : 6, 22 < end ? end : 22);
        timetable.addLocations(weekDays);
        timetable.usingTwelveHour = true;
        list.map((each) => {
            if (!weekDays[each.day + 1]) return;

            if (each.type === 1)
                timetable.addEvent(
                    each?.subject?.name + ` - ${each?.teacher?.name}`,
                    weekDays[each.day + 1],
                    new Date(0, 0, 0, Math.floor(each.startTime / 60), each.startTime % 60),
                    new Date(0, 0, 0, Math.floor(each.endTime / 60), each.endTime % 60),
                    {
                        class: classes.pointer,
                        data: each,
                        onClick: function (event, timetable, clickEvent) {
                            onClick(each, clickEvent);
                        },
                    },
                );

            if (each.type === 2)
                timetable.addEvent(
                    'Break',
                    weekDays[each.day + 1],
                    new Date(0, 0, 0, Math.floor(each.startTime / 60), each.startTime % 60),
                    new Date(0, 0, 0, Math.floor(each.endTime / 60), each.endTime % 60),
                    {
                        class: `${classes.pointer} break`,
                        data: each,
                        onClick: function (event, timetable, clickEvent) {
                            onClick(each, clickEvent);
                        },
                    },
                );
        });
        const renderer = new Timetable.Renderer(timetable);
        try {
            renderer.draw('.timetable');
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
        }
        syncScrollInit({});
        // setTimeTable(Timetable);
    };

    useEffect(() => {
        load();
    }, [list]);

    return <div className="timetable" />;
};

TimeTable.propTypes = {
    list: PropTypes.array.isRequired,
    onClick: PropTypes.func,
};

TimeTable.defaultProps = {
    onClick: () => {},
};

export default TimeTable;
