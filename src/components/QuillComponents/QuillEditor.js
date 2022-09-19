import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import dynamic from 'next/dynamic';
import CircularProgress from '@material-ui/core/CircularProgress';

const Quill = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => (
        <div
            style={{
                padding: '30px',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '50px',
            }}
        >
            <CircularProgress color="secondary" />{' '}
        </div>
    ),
});

const useStyles = withStyles((theme) => ({
    root: {
        '& .ql-editor': {
            minHeight: 100,
            background: theme.palette.other.textField,
        },
    },
}));
class QuillEditor extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        onChange: PropTypes.func,
        toolbar: PropTypes.array,
        value: PropTypes.string,
    };

    static defaultProps = {
        toolbar: [
            { header: [2, 3, 4, false] },
            'bold',
            'italic',
            'underline',
            'strike',
            {},
            { align: [] },
            { list: 'ordered' },
            { list: 'bullet' },
            {},
            'code',
            'link',
            { script: 'sub' },
            { script: 'super' },
            { color: [] },
            { background: [] },
            'image',

            // 'video',
            // { 'font': [] },
            // 'blockquote',
            // 'clean',
            // { 'direction': 'rtl' },
            // { 'indent': '-1'},
            // { 'indent': '+1' },
            // { 'size': ['small', false, 'large', 'huge'] },
            'formula',
        ],
    };

    state = { text: '', quillLoaded: false };

    handleChange = (value) => {
        //  this.setState({ text: value });
        const { onChange } = this.props;
        onChange(value);
    };

    render() {
        const { classes, value } = this.props;
        const { toolbar } = this.props;

        return (
            <Card className={classes.root}>
                {Boolean(Quill) /*quillLoaded &&*/ && (
                    <Quill
                        modules={{
                            toolbar,
                        }}
                        onChange={this.handleChange}
                        // theme='bubble'
                        theme="snow"
                        value={value}
                    />
                )}
            </Card>
        );
    }
}
export default useStyles(QuillEditor);
