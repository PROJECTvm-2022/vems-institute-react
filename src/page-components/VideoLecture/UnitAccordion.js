/**
 *
 * @createdBy Ramakanta Kar
 * @email ramakantakar1997@gmail.com
 * @description Teachers
 * @createdOn 29/01/21 08:25 PM
 */

import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ChapterService } from '../../apis/rest.app';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

const useStyle = makeStyles((theme) => ({
    accordionInner: {
        padding: 0,
    },
    menuList: {
        width: '100%',
    },
    menuItem: {
        padding: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

const UnitAccordion = ({ setExpanded, expanded, selectedChapter, setSelectedChapter, each }) => {
    const classes = useStyle();
    const [chapters, setChapters] = useState([]);

    const handleChangeAccordion = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    const LoadChapters = () => {
        // if (expanded === each._id && chapters.length === 0)
        if (chapters.length === 0)
            ChapterService.find({
                query: {
                    $skip: 0,
                    unit: each._id,
                    $limit: 50,
                },
            })
                .then((response) => {
                    const { data } = response;
                    setChapters(data);
                })
                .catch(() => {});
    };
    useEffect(() => {
        LoadChapters();
    }, []);

    return (
        <Accordion expanded={expanded === each._id} onChange={handleChangeAccordion(each._id)}>
            <AccordionSummary aria-controls="panel1bh-content" expandIcon={<ExpandMoreIcon />} id="panel1bh-header">
                <Typography>{each.name}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionInner}>
                <MenuList className={classes.menuList}>
                    {chapters &&
                        chapters.map((each) => (
                            <MenuItem
                                className={classes.menuItem}
                                key={each._id}
                                onClick={() => {
                                    setSelectedChapter(each);
                                }}
                            >
                                <Typography color={selectedChapter._id === each._id ? 'primary' : 'textPrimary'}>
                                    {each.name}
                                </Typography>
                            </MenuItem>
                        ))}
                </MenuList>
            </AccordionDetails>
        </Accordion>
    );
};

UnitAccordion.propTypes = {
    each: PropTypes.object.isRequired,
    setExpanded: PropTypes.func.isRequired,
    expanded: PropTypes.string.isRequired,
    selectedChapter: PropTypes.object.isRequired,
    setSelectedChapter: PropTypes.func.isRequired,
};

export default UnitAccordion;
