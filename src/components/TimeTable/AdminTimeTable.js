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

const AdminTImeTable = ({ list, onClick }) => {
    const classes = useStyle();

    const load = async () => {
        // if (!list.length) return;
        const Timetable = (await import('../../utils/TimeTable')).default;
        const syncScrollInit = (await import('../../utils/TimeTable')).syncScrollInit;
        const timetable = new Timetable();
        // const startTimeList = list.sort((a, b) => a.startTime < b.startTime);
        // const endTimeList = list.sort((a, b) => a.endTime < b.endTime);
        //
        // const start = list.length && Math.floor(startTimeList[0].startTime / 60);
        // const end = list.length && Math.floor(endTimeList[endTimeList.length - 1].endTime / 60);
        // timetable.setScope(start ? (start < 6 ? start : 6) : 0, end ? (23 > end ? end : 23) : 0);
        timetable.setScope(6, 22);
        timetable.addLocations(weekDays);
        timetable.usingTwelveHour = true;
        // console.log(start, end, startTimeList[0].startTime, endTimeList[endTimeList.length - 1].endTime);
        list.map((each) => {
            if (!weekDays[each.day]) return;

            // if (each.type === 1)
            timetable.addEvent(
                each.status === 1
                    ? each.requestsCount > 0
                        ? `Requests(${each.requestsCount})`
                        : 'Unallocated'
                    : (`${each?.course?.name} - ${each?.subject?.name}` )+ (each.requestsCount > 0 ? ` (${each.requestsCount})` : ''),
                weekDays[each.day],
                new Date(0, 0, 0, Math.floor(each.startTime / 60), each.startTime % 60),
                new Date(0, 0, 0, Math.floor(each.endTime / 60), each.endTime % 60),
                {
                    class: classes.pointer+(each.status === 1 ? each.requestsCount > 0
                        ? ' pending' : ' unallocated' :''),
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

AdminTImeTable.propTypes = {
    list: PropTypes.array.isRequired,
    onClick: PropTypes.func,
};

AdminTImeTable.defaultProps = {
    onClick: () => {},
};

export default AdminTImeTable;
