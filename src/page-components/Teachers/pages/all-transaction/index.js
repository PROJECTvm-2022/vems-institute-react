import React from 'react';
import { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InfiniteScroll from 'react-infinite-scroller';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Translate from '../../../../src/components/Translate';
import { useSnackbar } from 'notistack';
import TableContainer from '@material-ui/core/TableContainer';
import { useLanguage } from '../../src/store/LanguageStore';
// import Image from '../../public/Group 506.svg';
import TransactionsTableView from '../../src/page-components/TransactionsTableView';
import { TransactionService } from '../../src/apis/rest.app';
import { useRouter } from 'next/router';
import { getAllTransactions } from '../../../../apis/transaction';
import { useUser } from '../../../../store/UserContext';

const useStyle = makeStyles((theme) => ({
    buttonDiv: {
        fontWeight: 500,
        fontSize: 13,
    },
    switchButtonIcon: {
        marginLeft: theme.spacing(1),
        color: theme.palette.primary.main,
    },
    mainDiv: {
        marginTop: theme.spacing(3),
    },
}));

const Transactions = () => {
    const Router = useRouter();
    const { institute } = Router.query;
    const Language = useLanguage();
    const classes = useStyle();
    const [user, setUser] = useUser();
    const { enqueueSnackbar } = useSnackbar();
    const [hasMore, setHasMore] = useState(true);
    const [transactionData, setTransactionData] = useState([]);

    const LoadTransaction = () => {
        getAllTransactions(transactionData.length, user?.institute?._id)
            .then((response) => {
                const { data, total } = response;
                const result = [...transactionData, ...data];
                setHasMore(result.length < total);
                setTransactionData(result);
            })
            .catch((error) => {
                enqueueSnackbar(error.message ? error.message : Language.get('state.form.errors.deleteError'), {
                    variant: 'error',
                });
            });
    };

    return (
        <React.Fragment>
            <Grid container spacing={0}>
                <Grid item md={12} sm={12} xs={12}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography variant={'h3'}>
                            <Translate>{'transactions.title'}</Translate>
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <InfiniteScroll
                hasMore={hasMore}
                loadMore={LoadTransaction}
                loader={<CircularProgress size={28} />}
                pageStart={0}
            >
                {transactionData.length ? (
                    <div className={classes.mainDiv}>
                        <TableContainer bgcolor={'common.white'} borderRadius={'borderRadius'} component={Box} p={1}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">
                                            <Translate>{'transactions.no'}</Translate>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Translate>{'transactions.createdBy'}</Translate>
                                        </TableCell>
                                        <TableCell>
                                            <Translate>{'transactions.price'}</Translate>
                                        </TableCell>
                                        <TableCell>
                                            <Translate>{'transactions.institution'}</Translate>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactionData.map((each, index) => (
                                        <TransactionsTableView each={each} key={each._id} position={index} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                ) : hasMore ? (
                    ''
                ) : (
                    <Box
                        alignItems={'center'}
                        display={'flex'}
                        flexDirection={'column'}
                        justifyContent={'center'}
                        mt={5}
                    >
                        {/*<img alt={'image'} src={Image} />*/}
                        <Box mt={3} />
                        <Typography variant={'h2'}>
                            <Translate>{'transactions.noInstitution'}</Translate>
                        </Typography>
                        <Box mt={3} width={450}>
                            <Typography align={'center'} variant={'h3'}>
                                <Translate>{'transactions.oops'}</Translate>
                            </Typography>
                        </Box>
                    </Box>
                )}
            </InfiniteScroll>
        </React.Fragment>
    );
};

export default Transactions;
