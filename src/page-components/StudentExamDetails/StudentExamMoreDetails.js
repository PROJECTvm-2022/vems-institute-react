/**
 *
 * @createdBy Akash Mohapatra
 * @email mohapatra.akash99@gmail.com
 * @description
 * @createdOn 06/04/21 12:33 AM
 */

import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
// import AllQuestionsSection from './AllQuestionsSection';
// import Typography from '@material-ui/core/Typography';
// import ExamReportSection from './ExamReportSection';
// import AuduienceSection from './AuduienceSection';
import AllQuestionsSectionOfStudent from './AllQuestionsSectionOfStudent';

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

// const useStyle = makeStyles((theme) => ({
//     root: {
//         flexGrow: 1,
//         backgroundColor: '#ffffff',
//         display: 'flex',
//         // height: 224,
//     },
//     tabs: {
//         borderRight: `1px solid rgba(0, 0, 0, 0.12)`,
//     },
// }));

const StudentExamMoreDetails = ({ id, studentDetails }) => {
    // const classes = useStyle();

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <React.Fragment>
            <div>
                <Tabs
                    indicatorColor="primary"
                    onChange={handleChange}
                    orientation="horizontal"
                    textColor="primary"
                    value={value}
                    variant="scrollable"
                >
                    <Tab label="Answers" {...a11yProps(0)} />
                </Tabs>
                <TabPanel index={0} value={value}>
                    <AllQuestionsSectionOfStudent id={id} studentDetails={studentDetails} />
                </TabPanel>
                {/*<TabPanel index={1} value={value}>*/}
                {/*    <ExamReportSection />*/}
                {/*</TabPanel>*/}
                {/*<TabPanel index={2} value={value}>*/}
                {/*    <AuduienceSection />*/}
                {/*</TabPanel>*/}
            </div>
        </React.Fragment>
    );
};

export default StudentExamMoreDetails;
