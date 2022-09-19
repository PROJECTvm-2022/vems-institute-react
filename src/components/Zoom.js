import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import config from '../../config.json';

const Zoom = ({ signature, meetingNumber, leaveUrl, userName, role, password, apiKey }) => {
    // console.log('meetingNumber', meetingNumber);
    // console.log('userName', userName);
    // console.log('password', password);
    useEffect(() => {
        if (!signature) return;
        import('@zoomus/websdk').then((module) => {
            const { ZoomMtg } = module;
            ZoomMtg.setZoomJSLib('https://source.zoom.us/2.0.1/lib', '/av');
            ZoomMtg.preLoadWasm();
            ZoomMtg.prepareJssdk();
            const meetConfig = {
                // apiKey: config.zoom.apiKey,
                apiKey: apiKey,
                meetingNumber: meetingNumber,
                leaveUrl: leaveUrl,
                userName: userName,
                passWord: password,
                role: role,
            };

            ZoomMtg.init({
                leaveUrl: meetConfig.leaveUrl,
                isSupportAV: true,
                showMeetingHeader: false,
                isSupportChat: false,
                meetingInfo: [
                    // optional
                    'topic',
                    'host',
                    'mn',
                    'pwd',
                    'telPwd',
                    'invite',
                    'participant',
                    'dc',
                    'enctype',
                    'report',
                ],
                disablePreview: true,
                // on success, call the join method
                success: function () {
                    ZoomMtg.join({
                        // pass your signature response in the join method
                        signature: signature,
                        apiKey: meetConfig.apiKey,
                        meetingNumber: meetConfig.meetingNumber,
                        userName: meetConfig.userName,
                        passWord: meetConfig.passWord,
                        error: (res) => {
                            console.log(res);
                        },
                    });
                },
            });
        });
    }, []);

    return (
        <>
            <div id="zmmtg-root"></div>
        </>
    );
};

Zoom.propTypes = {
    signature: PropTypes.any.isRequired,
    meetingNumber: PropTypes.any.isRequired,
    leaveUrl: PropTypes.any.isRequired,
    userName: PropTypes.any.isRequired,
    role: PropTypes.any,
    password: PropTypes.any.isRequired,
    apiKey: PropTypes.any.isRequired,
};

export default Zoom;
// import Button from '@material-ui/core/Button';
// import React, { useState } from 'react';
// import crypto from 'crypto';
// import IconButton from '@material-ui/core/IconButton';
// import MicIcon from '@material-ui/icons/Mic';
// import Box from '@material-ui/core/Box';
// // import '../../node_modules/@zoomus/websdk/dist/css/bootstrap.css';
// // import '../../node_modules/@zoomus/websdk/dist/css/react-select.css';
//
// const index = () => {
//     function generateSignature(apiKey, apiSecret, meetingNumber, role) {
//         const timestamp = new Date().getTime() - 60 * 60 * 1000;
//         const msg = Buffer.from(`${apiKey}${meetingNumber}${timestamp}${role}`).toString('base64');
//         const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64');
//         const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');
//         return signature;
//     }
//     const [muteData, setMuteData] = useState(null);
//     const [isMute, setIsMute] = useState(false);
//     const [zoomMeeting, setZoomMeeting] = useState();
//     const startZoomMeeting = () => {
//         import('@zoomus/websdk').then((module) => {
//             const { ZoomMtg } = module;
//             setZoomMeeting(ZoomMtg);
//             // console.log(ZoomMtg);
//             ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.0/lib', '/av');
//             ZoomMtg.preLoadWasm();
//             ZoomMtg.prepareJssdk();
//             const meetConfig = {
//                 apiKey: 'wi2Kfj-uRhCaD6b0NhM7Aw',
//                 meetingNumber: '73476776731',
//                 leaveUrl: 'http://localhost:7000/test',
//                 userName: 'Guru Prasad1',
//                 passWord: '7pBVgm',
//                 role: 1,
//                 apiSecret: '3DD7nVh8XjOgyb8MJjAprcuYfe1YuV5KBqI6', // 1 for host
//             };
//             let _userId = null;
//             ZoomMtg.inMeetingServiceListener('onUserJoin', function (data) {
//                 setMuteData(data);
//                 _userId = data.userId;
//                 console.log('data', data);
//             });
//             ZoomMtg.mute({
//                 userId: _userId,
//                 mute: isMute,
//             });
//             ZoomMtg.init({
//                 leaveUrl: meetConfig.leaveUrl,
//                 isSupportAV: true,
//                 // on success, call the join method
//                 success: function () {
//                     ZoomMtg.join({
//                         // pass your signature response in the join method
//                         signature: generateSignature(
//                             meetConfig.apiKey,
//                             meetConfig.apiSecret,
//                             meetConfig.meetingNumber,
//                             meetConfig.role,
//                         ),
//                         apiKey: meetConfig.apiKey,
//                         meetingNumber: meetConfig.meetingNumber,
//                         userName: meetConfig.userName,
//                         passWord: meetConfig.passWord,
//                         error: (res) => {
//                             console.log(res);
//                         },
//                     });
//                 },
//             });
//         });
//     };
//
//     const onChangeMic = () => {
//         zoomMeeting.mute({
//             userId: muteData.userId,
//             mute: !isMute,
//         });
//         setIsMute(!isMute);
//         let _user = zoomMeeting.getCurrentUser({});
//         console.log('user', _user);
//     };
//
//     return (
//         <>
//             <Button onClick={startZoomMeeting}>Click me</Button>
//             <div id="zmmtg-root"></div>
//             {/*<Box p={3}>*/}
//             {/*    <IconButton color={'secondary'} onClick={onChangeMic}>*/}
//             {/*        <MicIcon color={'primary'} fontSize={'large'} />*/}
//             {/*    </IconButton>*/}
//             {/*</Box>*/}
//         </>
//     );
// };
//
// export default index;
