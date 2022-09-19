import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import AllLiveClasses from './AllLiveClasses';
import AllExams from './AllExams';
import AllStudentsInTheBatch from './AllStudentsInTheBatch';
import AllSyllabus from './AllSyllabus';
import TimeTables from './TimeTables';
import AllAssignments from './AllAssignmets';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            aria-labelledby={`vertical-tab-${index}`}
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            role="tabpanel"
            {...other}
            style={{ width: '100%' }}
        >
            {value === index && (
                <Box p={3} width={'100%'}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyle = makeStyles(() => ({
    root: {
        flexGrow: 1,
        backgroundColor: '#ffffff',
        display: 'flex',
        // height: 224,
    },
    tabs: {
        borderRight: `1px solid rgba(0, 0, 0, 0.12)`,
        width: '18%',
    },
}));

const AboutBatchDetails = ({ batchId, batchDetails }) => {
    const classes = useStyle();

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <React.Fragment>
            <Paper>
                <div className={classes.root}>
                    <Tabs
                        className={classes.tabs}
                        indicatorColor="primary"
                        onChange={handleChange}
                        orientation="vertical"
                        textColor="primary"
                        value={value}
                        variant="scrollable"
                    >
                        <Tab label="Live Classes" {...a11yProps(0)} />
                        <Tab label="Exams" {...a11yProps(1)} />
                        <Tab label="Students" {...a11yProps(2)} />
                        <Tab label="Syllabus" {...a11yProps(3)} />
                        <Tab label="Timetable" {...a11yProps(4)} />
                        <Tab label="Assignments" {...a11yProps(5)} />
                    </Tabs>
                    <TabPanel index={0} value={value}>
                        <AllLiveClasses id={batchId} />
                    </TabPanel>
                    <TabPanel index={1} value={value}>
                        <AllExams id={batchId} />
                    </TabPanel>
                    <TabPanel index={2} value={value}>
                        <AllStudentsInTheBatch id={batchId} />
                    </TabPanel>
                    <TabPanel index={3} value={value}>
                        <AllSyllabus batchDetails={batchDetails} id={batchId} />
                    </TabPanel>
                    <TabPanel index={4} value={value}>
                        <TimeTables batchId={batchId} />
                        {'Timetable'}
                        {/*<AuduienceSection />*/}
                    </TabPanel>
                    <TabPanel index={5} value={value}>
                        <AllAssignments id={batchId} />
                    </TabPanel>
                </div>
            </Paper>
        </React.Fragment>
    );
};

export default AboutBatchDetails;
