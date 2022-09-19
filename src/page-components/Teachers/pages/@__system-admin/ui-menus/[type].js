import React, { useEffect, useState } from 'react';
import SystemAdminLayout from '../../../src/components/Layouts/SystemAdminLayout';
import Typography from '@material-ui/core/Typography';
import { useUILanguages } from '../../../src/store/UILanguagesContext';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { UIMenuService } from '../../../src/apis/rest.app';
import useHandleError from '../../../src/hooks/useHandleError';
import { useRouter } from 'next/router';
import { useUIIcons } from '../../../src/store/UIIconsContext';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { makeStyles } from '@material-ui/core/styles';
import useStateObject from '../../../src/hooks/useStateObject';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Switch from '@material-ui/core/Switch';
import DynamicMenuIcon from '../../../src/components/DynamicMenuIcon';
import Confirm from '../../../src/components/Confirm';
import InstituteAutocomplete from '../../../src/components/Autocompletes/InstituteAutocomplete';

const useStyles = makeStyles({
    img: {
        height: 20,
        width: 'auto',
    },
});

const UILanguages = () => {
    const [UIMenus, setUIMenus] = useStateObject([]);
    const [isMaterialIcon, setIsMaterialIcon] = useState(false);
    const [MaterialIcons, setMaterialIcons] = useState(null);
    const [materialIconNames, setMaterialIconNames] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [name, setName] = useStateObject({});
    const [icon, setIcon] = useState('');
    const [materialIconName, setMaterialIconName] = useState('');
    const [href, setHref] = useState('');
    const [isGroup, setIsGroup] = useState(false);
    const [options, setOptions] = useStateObject([
        {
            name: {},
            icon,
            href,
            isGroup: false,
        },
    ]);

    const [institute, setInstitute] = useState(null);

    const handleError = useHandleError();
    const Router = useRouter();

    const classes = useStyles();

    const { type } = Router.query;

    const [icons] = useUIIcons();
    const [languages] = useUILanguages();

    const handleCreateLanguage = () => {
        try {
            UIMenuService.create(
                {
                    name,
                    icon: icon ? icon : undefined,
                    materialIconName,
                    type,
                    href,
                    isGroup,
                    isMaterialIcon,
                    ...(institute ? { institute } : {}),
                },
                { query: { $populate: ['icon', 'createdBy'] } },
            )
                .then((response) => {
                    if (isGroup) {
                        options.map((each) => {
                            each.type = type;
                            each.parent = response._id;
                        });
                        UIMenuService.create(options);
                    }
                    setUIMenus((menus) => {
                        menus.push(response);
                        return menus;
                    });
                    setName({});
                    setIcon('');
                    setDialogOpen(false);
                    setHref('');
                })
                .catch(handleError());
        } catch (e) {
            handleError()(e);
        }
    };

    const handleChangeStatus = (index, id, status) => () => {
        Confirm('Are you sure?').then(() => {
            UIMenuService.patch(id, { status }, { query: { $populate: ['icon', 'createdBy'] } })
                .then((response) => {
                    setUIMenus((menus) => {
                        menus[index] = response;
                        return menus;
                    });
                })
                .catch(handleError());
        });
    };

    useEffect(() => {
        import('@material-ui/icons').then((icons) => {
            setMaterialIcons(icons);
            setMaterialIconNames(Object.keys(icons));
        });
    }, [Router.pathname]);

    useEffect(() => {
        const query = { type, $populate: ['icon', 'createdBy'] };
        if (type !== 'ADMIN' && institute) {
            query.institute = institute; // ? institute : JSON.stringify(institute);
        }
        UIMenuService.find({ query })
            .then((response) => {
                setUIMenus(response);
            })
            .catch(handleError());
    }, [type, institute]);

    useEffect(() => {
        if (isGroup) setHref('#');
    }, [isGroup]);

    const handleOptionData = (key, index) => (event) =>
        setOptions((option) => {
            option[index][key] = event.target.value;
            return option;
        });

    const handleDelete = (row, position) => {
        Confirm('Are you sure').then(() => {
            UIMenuService.remove(row._id)
                .then(() => {
                    let _UIMenus = UIMenus;
                    _UIMenus.splice(position, 1);
                    setUIMenus([]);
                    setUIMenus(_UIMenus);
                })
                .catch(handleError());
        });
    };

    return (
        <div>
            <Box display="flex" justifyContent="space-between" mb={2} mt={1}>
                <Typography variant="h4">UI {type} Menu</Typography>
                {type !== 'ADMIN' && (
                    <Box width={200}>
                        <InstituteAutocomplete onSelect={(ins) => setInstitute(ins?._id || null)} />
                    </Box>
                )}
                <Button color="primary" onClick={() => setDialogOpen(true)} variant="contained">
                    Create UI {type} Menu
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Icon</TableCell>
                            <TableCell>Href</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {UIMenus &&
                            UIMenus.map((row, index) => (
                                <TableRow key={row._id}>
                                    <TableCell component="th" scope="row">
                                        {Object.keys(row.name).map((key) => (
                                            <span key={key}>
                                                {key} : {row.name[key]}
                                                <br />
                                            </span>
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        <DynamicMenuIcon classes={{ img: classes.img }} menu={row} />
                                        {/*<Avatar src={row.icon.path} alt={row._id} classes={{ img: classes.img }} />*/}
                                    </TableCell>
                                    <TableCell>{row.href}</TableCell>
                                    <TableCell align="right">
                                        {row.status}
                                        <Switch
                                            checked={row.status === 1}
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            name="checkedA"
                                            onChange={handleChangeStatus(index, row._id, row.status === 1 ? -1 : 1)}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton>
                                            <Delete
                                                onClick={() => {
                                                    handleDelete(row, index);
                                                }}
                                            />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                aria-labelledby="form-dialog-title"
                fullWidth
                maxWidth="xs"
                onClose={() => setDialogOpen(false)}
                open={dialogOpen}
            >
                <DialogTitle id="form-dialog-title">Create UI {type} Menu</DialogTitle>
                <DialogContent>
                    {/*<DialogContentText>*/}
                    {/*    To subscribe to this website, please enter your email address here. We will send updates*/}
                    {/*    occasionally.*/}
                    {/*</DialogContentText>*/}
                    {languages.map((lang, index) => (
                        <TextField
                            autoFocus={index === 0}
                            fullWidth
                            key={lang.code}
                            label={`Name - ${lang.name} ( ${lang.code} )`}
                            margin="dense"
                            onChange={(ev) =>
                                setName((n) => {
                                    n[lang.code] = ev.target.value;
                                    return n;
                                })
                            }
                            type="text"
                            value={name[lang.code] || ''}
                            variant="outlined"
                        />
                    ))}

                    {isMaterialIcon ? (
                        <Autocomplete
                            getOptionLabel={(option) => option}
                            id="combo-box-demo"
                            onChange={(ev, icon) => setMaterialIconName(icon)}
                            options={materialIconNames}
                            renderInput={(params) => (
                                <TextField {...params} fullWidth label="Combo box" variant="outlined" />
                            )}
                            renderOption={(option) => {
                                const MUIIcon = MaterialIcons[option];
                                return (
                                    <React.Fragment>
                                        <MUIIcon />
                                        {option}
                                    </React.Fragment>
                                );
                            }}
                        />
                    ) : (
                        <TextField
                            fullWidth
                            label="Icon"
                            margin="dense"
                            onChange={(ev) => setIcon(ev.target.value)}
                            select
                            size="small"
                            type="text"
                            value={icon}
                            variant="outlined"
                        >
                            <MenuItem disabled value={''}>
                                {'--- Select Icon ---'}
                            </MenuItem>
                            {icons.map((option) => (
                                <MenuItem key={option._id} value={option._id}>
                                    <ListItemIcon>
                                        <Avatar alt={option.name} classes={{ img: classes.img }} src={option.path} />
                                    </ListItemIcon>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isMaterialIcon}
                                color="primary"
                                name="checkedB"
                                onChange={(ev) => {
                                    setIsMaterialIcon(ev.target.checked);
                                    setIcon('');
                                    setMaterialIconName('');
                                }}
                            />
                        }
                        label="Is Material Icon"
                    />

                    <TextField
                        disabled={isGroup}
                        fullWidth
                        label="href"
                        margin="dense"
                        onChange={(ev) => setHref(ev.target.value)}
                        type="url"
                        value={href}
                        variant="outlined"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isGroup}
                                color="primary"
                                name="checkedB"
                                onChange={(ev) => setIsGroup(ev.target.checked)}
                            />
                        }
                        label="Is Group"
                    />

                    {isGroup && (
                        <React.Fragment>
                            {options.map((option, optionIndex) => (
                                <Box
                                    // eslint-disable-next-line react/no-array-index-key
                                    border={1}
                                    borderColor="grey.600"
                                    borderRadius="borderRadius"
                                    key={optionIndex}
                                    mt={1}
                                    p={1}
                                >
                                    <Box display="flex" justifyContent={'space-between'} textAlign="center">
                                        <Typography>Option - {optionIndex + 1}</Typography>
                                        {optionIndex !== 0 && (
                                            <Button
                                                color="secondary"
                                                onClick={() =>
                                                    setOptions((options) => {
                                                        options.splice(optionIndex, 1);
                                                        return options;
                                                    })
                                                }
                                                variant="outlined"
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </Box>
                                    {languages.map((lang, index) => (
                                        <TextField
                                            autoFocus={index === 0}
                                            fullWidth
                                            key={lang.code}
                                            label={`Option Name - ${lang.name} ( ${lang.code} )`}
                                            margin="dense"
                                            onChange={(ev) =>
                                                setOptions((option) => {
                                                    option[optionIndex].name[lang.code] = ev.target.value;
                                                    return option;
                                                })
                                            }
                                            type="text"
                                            value={option.name[lang.code] || ''}
                                            variant="outlined"
                                        />
                                    ))}

                                    <TextField
                                        fullWidth
                                        label="Icon"
                                        margin="dense"
                                        onChange={handleOptionData('icon', optionIndex)}
                                        select
                                        size="small"
                                        type="text"
                                        value={option.icon || ''}
                                        variant="outlined"
                                    >
                                        <MenuItem disabled value={''}>
                                            {'--- Select Icon ---'}
                                        </MenuItem>
                                        {icons.map((option) => (
                                            <MenuItem key={option._id} value={option._id}>
                                                <ListItemIcon>
                                                    <Avatar
                                                        alt={option.name}
                                                        classes={{ img: classes.img }}
                                                        src={option.path}
                                                    />
                                                </ListItemIcon>
                                                {option.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        fullWidth
                                        label="href"
                                        margin="dense"
                                        onChange={handleOptionData('href', optionIndex)}
                                        type="url"
                                        value={option.href || ''}
                                        variant="outlined"
                                    />
                                </Box>
                            ))}
                            <Box mt={1}>
                                <Button
                                    color="secondary"
                                    onClick={() =>
                                        setOptions((options) => {
                                            options.push({
                                                name: {},
                                                icon: '',
                                                href: '',
                                            });

                                            return options;
                                        })
                                    }
                                    variant="outlined"
                                >
                                    Add More Option
                                </Button>
                            </Box>
                        </React.Fragment>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => setDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button color="primary" onClick={handleCreateLanguage}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

UILanguages.layout = SystemAdminLayout;

export default UILanguages;
