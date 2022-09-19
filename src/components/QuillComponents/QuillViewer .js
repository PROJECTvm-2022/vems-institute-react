import React from 'react';
import PropTypes  from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
    flatContainer: {
        border: 'none !important',
        fontSize: '15px !important',
        padding: '2 !important',
        wordBreak: 'break-all',
    },
    flatEditor: {
        padding: '0 !important'
    }
};

function QuillViewer({html, className, flat, classes}) {

    return (
        <div className={'ql-container ql-snow' + (flat ? ' ' + classes.flatContainer : '')}>
            <div
                className={
                    'ql-editor' +
                    (className ? ' ' + className : '') +
                    (flat ? ' ' + classes.flatEditor : '')
                }
                dangerouslySetInnerHTML={{
                    __html: html
                }}
            />
        </div>
    );
}

QuillViewer.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    flat: PropTypes.bool,
    html: PropTypes.string.isRequired,
    sanitize: PropTypes.bool,
};

QuillViewer.defaultProps = {
    html: '',
    className: '',
    flat: true
};

export default withStyles(styles)(QuillViewer);
