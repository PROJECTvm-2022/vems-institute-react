import React, { useEffect, useRef, useState } from 'react';
import Translate from '../../src/components/Translate';
import PageHeaderComponent from '../../src/components/PageHeaderComponent';
import Box from '@material-ui/core/Box';
import InstituteAutocomplete from '../../src/components/Autocompletes/InstituteAutocomplete';
import CourseAutocomplete from '../../src/components/Autocompletes/CourseAutocomplete';
import SpecializationAutocomplete from '../../src/components/Autocompletes/SpecializationAutocomplete';
import SemesterAutocomplete from '../../src/components/Autocompletes/SemesterAutocomplete';
import InfiniteScroll from 'react-infinite-scroller';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { SyllabusesService } from '../../src/apis/rest.app';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { Animated } from 'react-animated-css';
import Link from '../../src/components/Link';
import { createPageStore } from '../../src/store/PageGlobalContext';
import style from '../../src/assets/styles/common.module.css';
import Dvr from '@material-ui/icons/Dvr';
import FormatListNumbered from '@material-ui/icons/FormatListNumbered';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyle = makeStyles((theme) => ({
    marginRight: {
        marginRight: theme.spacing(0.8),
    },
}));

const VideoLectures = () => {
    const usePageState = createPageStore();

    const [institute, setInstitute] = usePageState('institute', null);
    const [course, setCourse] = useState(null);
    const [specialization, setSpecialization] = useState(null);
    const [semester, setSemester] = useState(null);

    const [syllabuses, setSyllabuses] = usePageState('syllabuses', []);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const isFirstLoad = useRef(true);

    const styles = useStyle();

    const loadSyllabus = () => {
        if (loading) return;
        setLoading(true);
        SyllabusesService.find({
            query: {
                $skip: syllabuses.length,
                ...(institute && institute._id ? { institute: institute._id } : {}),
                ...(course && course._id ? { course: course._id } : {}),
                ...(specialization && specialization._id ? { specialization: specialization._id } : {}),
                ...(semester && semester._id ? { semester: semester._id } : {}),
                $populate: ['course', 'specialization', 'subject', 'semester'],
                $limit: 8,
            },
        })
            .then((response) => {
                const { total, data } = response;
                const _syllabuses = [...syllabuses, ...data];
                setSyllabuses(_syllabuses);
                setHasMore(total > _syllabuses.length);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return;
        }
        setSyllabuses([]);
        setHasMore(true);
    }, [institute, course, specialization]);

    return (
        <React.Fragment>
            <PageHeaderComponent
                // addButtonText={<Translate>{'video-lecture.addButton'}</Translate>}
                onChange={() => {
                    // setSearch(e.target.value);
                    // setPageRows([]);
                }}
                // searchPlaceholder={<Translate>{'courses.searchPlaceholder'}</Translate>}
                // selected={selected}
                // setOpenCreate={setOpenCreate}
                // setSearch={setSearch}
                // setSelected={setSelected}
                title={<Translate>{'video-lecture.title'}</Translate>}
                value={''}
            />
            <Box>
                <Box display="flex" flexWrap="wrap">
                    <Box maxWidth="100%" mb={1} mr={1} width={250}>
                        <InstituteAutocomplete
                            onSelect={(ev) => setInstitute(ev || null)}
                            size="small"
                            value={institute && institute.name}
                        />
                    </Box>
                    <Box maxWidth="100%" mb={1} mr={1} width={250}>
                        <CourseAutocomplete
                            disabled={!institute}
                            institute={institute && institute._id}
                            onSelect={(ev) => setCourse(ev || null)}
                            searchOnEmpty={Boolean(institute)}
                            size="small"
                        />
                    </Box>
                    <Box maxWidth="100%" mb={1} mr={1} width={250}>
                        <SpecializationAutocomplete
                            course={course && course._id}
                            disabled={!course}
                            institute={institute && institute._id}
                            onSelect={(ev) => setSpecialization(ev || null)}
                            searchOnEmpty={Boolean(course)}
                            size="small"
                        />
                    </Box>
                    <Box maxWidth="100%" mb={1} mr={1} width={250}>
                        <SemesterAutocomplete
                            disabled={!course}
                            onSelect={(ev) => setSemester(ev || null)}
                            searchOnEmpty={true}
                            size="small"
                        />
                    </Box>
                </Box>

                <Box fontSize="h3.fontSize" mb={2} mt={1.5}>
                    <Translate>{'video-lecture.selectSyllabus'}</Translate>
                </Box>

                <Grid
                    component={InfiniteScroll}
                    container
                    hasMore={hasMore}
                    loadMore={loadSyllabus}
                    loader={
                        <React.Fragment>
                            {new Array(8).fill(0).map((each, index) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <Grid item key={index} md={3} sm={12}>
                                    <Box height={90}>
                                        <Skeleton component={'div'} height="100%" variant="rect" width="100%" />
                                    </Box>
                                </Grid>
                            ))}
                        </React.Fragment>
                    }
                    pageStart={0}
                    spacing={2}
                >
                    {syllabuses.map((each, index) => (
                        <Grid
                            animationIn="zoomIn"
                            animationInDelay={index}
                            component={Animated}
                            isVisible={true}
                            item
                            key={each._id}
                            lg={2}
                            md={3}
                            sm={3}
                            xs={12}
                        >
                            <Link as={`/video-lecture/${each._id}`} href="/video-lecture/[syllabusId]">
                                <Paper>
                                    <Box height={70} p={2}>
                                        <Typography className={style.ellipsis} color="textPrimary" variant="h4">
                                            {each.subject.name}
                                        </Typography>
                                        <Box
                                            className={style.ellipsis}
                                            fontSize="caption"
                                            fontWeight="fontWeightRegular"
                                            mt={0.5}
                                        >
                                            {each.course.name}
                                        </Box>
                                    </Box>
                                    <Box
                                        bgcolor="grey.200"
                                        borderColor="grey.300"
                                        borderTop={2}
                                        display={'flex'}
                                        fontSize={12}
                                        justifyContent="space-around"
                                        px={2}
                                        py={1}
                                    >
                                        <Box
                                            alignItems="center"
                                            className={style.ellipsis}
                                            display="flex"
                                            fontSize="caption"
                                            fontWeight="fontWeightRegular"
                                            maxWidth="49%"
                                        >
                                            <Dvr className={styles.marginRight} fontSize="inherit" />
                                            {each.specialization.name}
                                        </Box>
                                        <Box
                                            className={style.ellipsis}
                                            fontSize="caption"
                                            fontWeight="fontWeightRegular"
                                        >
                                            {'·'}
                                        </Box>
                                        <Box
                                            alignItems="center"
                                            className={style.ellipsis}
                                            display="flex"
                                            fontSize="caption"
                                            fontWeight="fontWeightRegular"
                                            maxWidth="49%"
                                        >
                                            <FormatListNumbered className={styles.marginRight} fontSize="inherit" />
                                            {each.semester.name}
                                        </Box>
                                    </Box>
                                </Paper>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </React.Fragment>
    );
};

export default VideoLectures;
