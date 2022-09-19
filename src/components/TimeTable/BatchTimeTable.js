import React, { useEffect } from 'react';
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

    // const [list, setList] = useState(data && data.map((each) => each.teacherSlot));

    const load = async () => {
        // if (!list.length) return;
        const Timetable = (await import('../../utils/TimeTable')).default;
        const syncScrollInit = (await import('../../utils/TimeTable')).syncScrollInit;
        const timetable = new Timetable();
        const newList = list?.teacherSlot?.sort((a, b) => a.startTime > b.startTime);
        const start = list?.teacherSlot?.length && Math.floor(newList[0].startTime / 60);
        const end = list?.teacherSlot?.length && Math.ceil(newList[newList.length - 1].endTime / 60);
        timetable.setScope(start < 6 ? start : 6, 22 < end ? end : 22);
        timetable.addLocations(weekDays);
        timetable.usingTwelveHour = true;
        list.sort((a, b) => a?.teacherSlot?.day - b?.teacherSlot.day).forEach((each, i) => {
            if (!weekDays[each?.teacherSlot?.day]) {
                return;
            }
            // if (each.type === 1)
            timetable.addEvent(
                `${each?.course?.name} - ${each?.subject?.name}`,
                weekDays[each?.teacherSlot?.day],
                new Date(0, 0, 0, Math.floor(each?.teacherSlot?.startTime / 60), each?.teacherSlot?.startTime % 60),
                new Date(0, 0, 0, Math.floor(each?.teacherSlot?.endTime / 60), each?.teacherSlot?.endTime % 60),
                {
                    class: classes.pointer,
                    data: each?.teacherSlot,
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
