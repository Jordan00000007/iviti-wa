import React, { useState, useEffect, useRef } from 'react';
import log from "../../utils/console";
import { Buffer } from "buffer";
import { PropaneSharp } from '@mui/icons-material';

const RemoteVideo = ({ uuid, status, onPlaying, fullScreen,onError }) => {
    const STREAM_SERVER = process.env.REACT_APP_STREAM_SERVER;
    const [remoteStream, setRemoteStream] = useState(null);
    const remoteVideoRef = useRef(null);
    const [videoMessage, setVideoMessage] = useState('Loading...');
    const [intervalId, setIntervalId] = useState(null);
    const [peerConnectionError, setPeerConnectionError] = useState(false);



    const getStreaming = () => {

        log('--- remote video start (web rtc) ---')

        log('(1) Create RTCPeerConnection')
        const peerConnection = new RTCPeerConnection({
            iceServers: [{
                urls: ['stun:stun.l.google.com:19302']
            }],
            sdpSemantics: 'unified-plan'
        })

        log("(2) Add Transceiver");
        peerConnection.addTransceiver('video', { 'direction': 'sendrecv' })

        log("(3) Define Negotiation");
        peerConnection.onnegotiationneeded = async function handleNegotiationNeeded() {

            log('(3-1) Create Offer');
            // 建立請求
            const offer = await peerConnection.createOffer()

            // 提供本地端的資訊
            await peerConnection.setLocalDescription(offer);

            log('(3-2) Trying to Get Remote Request');
            // 使用 http 與 remote 進行請求，需要透過 sdp 去請求

            const trg_url = `${STREAM_SERVER}/stream/${uuid}/channel/0/webrtc`;

            fetch(trg_url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
                // body: 'data=' + btoa(offer.sdp)
                body: 'data='+Buffer.from(offer.sdp).toString('base64')
            })
            .then((response) => {
                return response.text()        
            })
            .then((body) => {

                
                if (body.slice(0,1)==='{'){
                    const myBody=JSON.parse(body);
                    setVideoMessage('Something wrong with this AI task.');
                    onPlaying(false);
                    onError(myBody.payload);
                    log(myBody.payload);
                    setPeerConnectionError(true);

                }else{
                    peerConnection.setRemoteDescription(
                        new RTCSessionDescription({
                            type: 'answer',
                            //sdp: atob(decodeURIComponent(body))
                            sdp: Buffer.from(decodeURIComponent(body),'base64')
                            //decodeURIComponent
                        })
                    )
                }

            })
            .catch(function (err) {
                log('--- err ---')
                log(err)
                //setTimeout( setPeerConnectionError(true), 30000);
            });
        }

        log("(4) Define Track Event");
        peerConnection.ontrack = function (event) {

            setRemoteStream(event.streams[0]);
        
        }


        peerConnection.oniceconnectionstatechange = (e) => { 
          
            log('peerConnection')
            log(e.currentTarget)

            if (e.currentTarget.iceConnectionState==='disconnected'){
                setPeerConnectionError(true);
                log('peerConnection')
            }

            if (e.currentTarget.iceConnectionState==='connected'){
                setPeerConnectionError(false);
            }
            
           
        };

        
    }

    useEffect(() => {

      

    }, []);

    useEffect(() => {

        let id;
       
        if (peerConnectionError) {
            
            id = setInterval(getStreaming, 30000);
            setIntervalId(id);
            setPeerConnectionError(false);
        }else{
            log('clear interval id')
            clearInterval(id);
        }

        return () => clearInterval(intervalId);

    }, [peerConnectionError]);

    useEffect(() => {

        //setVideoMessage('loading...');

        log(`--- status : ${status} ---`)
        let timer = null;

        if (status === 'run') {

            //clearTimeout(myTimer);

            getStreaming();

            // timer = setInterval(() => {
            //     getStreaming();
            // }, 10000);

            // setIntervalId(timer);


        }

        return () => clearInterval(timer);

    }, [status]);

    useEffect(() => {

        log('remote stream')
        //log(remoteStream)

        if (remoteStream) {
            log('(5) set remote stream ---')
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
        }
    }, [remoteStream]);


    useEffect(() => {

        if (status === 'set_task_run_loading') {
            setVideoMessage('Loading...');
            onPlaying(false);
        }
        if (status === 'run') {
            setVideoMessage('Get streaming...');
        }
        if (status === 'stop') {
            setVideoMessage('Switch on the AI task to view inference.');
            onPlaying(false);
        }
        if (status === 'set_task_stop_loading') {
            setVideoMessage('Stoping...');
            onPlaying(false);
        }
        if (status.toLowerCase().indexOf('err') >= 0) {
            setVideoMessage('Something wrong with this AI task.');
            onPlaying(false);
        }

    }, [status]);

    const myWaitting = () => {
        log('waitting');
        //setVideoMessage('loading...');
    }

    const myError = () => {
        log('video error... ');
        //setVideoMessage('loading...');
    }

    const myPlaying = () => {
        log('playing');
        //setVideoMessage('loading...');
        setPeerConnectionError(false);
        setVideoMessage('');
        clearInterval(intervalId);
        setIntervalId(null);
        onPlaying(true);
    }

    

    return (
        <div style={{ position: 'relative' }}>

            <video ref={remoteVideoRef} width={(fullScreen) ? window.innerWidth : "841px"} height={(fullScreen) ? window.innerHeight : "604px"} autoPlay muted className='my-video-player' onPlaying={myPlaying} onWaiting={myWaitting} onError={myError} allow='fullscreen' >
                Your browser does not support the video tag.
            </video>

            {
                (videoMessage !== '') &&
                <div style={{ position: 'absolute', top: 0, left: 0, width: 841, height: 604, zIndex: 1, color: '#FFFFFF66' }} className='my-video-message d-flex justify-content-center align-items-center roboto-h5'>
                    <div>
                        {videoMessage}
                    </div>
                </div>
            }



        </div >

    );
};

export default RemoteVideo;
