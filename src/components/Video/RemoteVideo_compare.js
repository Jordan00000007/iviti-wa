import React, { useState, useEffect, useRef } from 'react';
import log from "../../utils/console";
import { Buffer } from "buffer";
import { PropaneSharp } from '@mui/icons-material';
import Hls from 'hls.js';

const RemoteVideo = ({ uuid, status, onPlaying, fullScreen, onError }) => {
    const STREAM_SERVER = process.env.REACT_APP_STREAM_SERVER;
    const [remoteStream, setRemoteStream] = useState(null);
    //const remoteVideoRef = useRef(null);
    const remoteVideoRef1 = useRef(null);
    const remoteVideoRef2 = useRef(null);
    const remoteVideoRef3 = useRef(null);
    const [videoMessage, setVideoMessage] = useState('Loading...');
    const [intervalId, setIntervalId] = useState(null);
    const [peerConnectionError, setPeerConnectionError] = useState(false);



    const getStreaming = () => {

        log('--- remote video start (web rtc) ---')

        log('(1) Create RTCPeerConnection')
        // const peerConnection = new RTCPeerConnection({
        //     // iceServers: [{
        //     //     // urls: ['stun:stun.l.google.com:19302']
        //     //     urls: ['stun:192.168.8.134:3478']
        //     // }],

        //     iceServers: [],
        //     sdpSemantics: 'unified-plan'
        // })

        const peerConnection = new RTCPeerConnection()

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
                body: 'data=' + Buffer.from(offer.sdp).toString('base64')
            })
                .then((response) => {
                    return response.text()
                })
                .then((body) => {


                    if (body.slice(0, 1) === '{') {
                        const myBody = JSON.parse(body);
                        setVideoMessage('Something wrong with this AI task.');
                        // onPlaying(false);
                        // onError(myBody.payload);
                        log(myBody.payload);
                        setPeerConnectionError(true);

                    } else {
                        peerConnection.setRemoteDescription(
                            new RTCSessionDescription({
                                type: 'answer',
                                //sdp: atob(decodeURIComponent(body))
                                sdp: Buffer.from(decodeURIComponent(body), 'base64')
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

            if (e.currentTarget.iceConnectionState === 'disconnected') {
                setPeerConnectionError(true);
                log('peerConnection')
            }

            if (e.currentTarget.iceConnectionState === 'connected') {
                setPeerConnectionError(false);
            }


        };


    }

    const mseQueue = []
    let mseSourceBuffer
    let mseStreamingStarted = false

    const Utf8ArrayToStr = (array) => {
        var out, i, len, c;
        var char2, char3;
        out = "";
        len = array.length;
        i = 0;
        while (i < len) {
            c = array[i++];
            switch (c >> 4) {
                case 7:
                    out += String.fromCharCode(c);
                    break;
                case 13:
                    char2 = array[i++];
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    }

    const startPlay = (videoEl, url) => {

        const mse = new MediaSource()
        videoEl.src = window.URL.createObjectURL(mse)
        mse.addEventListener('sourceopen', function () {
            const ws = new WebSocket(url)
            ws.binaryType = 'arraybuffer'
            ws.onopen = function (event) {
                console.log('Connect to ws')
            }
            ws.onmessage = function (event) {
                const data = new Uint8Array(event.data)
                if (data[0] === 9) {
                    let mimeCodec
                    const decodedArr = data.slice(1)
                    if (window.TextDecoder) {
                        mimeCodec = new TextDecoder('utf-8').decode(decodedArr)
                    } else {
                        mimeCodec = Utf8ArrayToStr(decodedArr)
                    }
                    mseSourceBuffer = mse.addSourceBuffer('video/mp4; codecs="' + mimeCodec + '"')
                    mseSourceBuffer.mode = 'segments'
                    mseSourceBuffer.addEventListener('updateend', pushPacket)
                } else {
                    readPacket(event.data)
                }
            }
        }, false)
    }

    const pushPacket = () => {

        //const videoEl = document.querySelector('#mse-video')
        const videoEl = remoteVideoRef2.current
        let packet

        if (!mseSourceBuffer.updating) {
            if (mseQueue.length > 0) {
                packet = mseQueue.shift()
                mseSourceBuffer.appendBuffer(packet)
            } else {
                mseStreamingStarted = false
            }
        }
        if (videoEl.buffered.length > 0) {
            if (typeof document.hidden !== 'undefined' && document.hidden) {
                // no sound, browser paused video without sound in background
                videoEl.currentTime = videoEl.buffered.end((videoEl.buffered.length - 1)) - 0.5
            }
        }
    }

    const readPacket = (packet) => {

        if (!mseStreamingStarted) {
            mseSourceBuffer.appendBuffer(packet)
            mseStreamingStarted = true
            return
        }
        mseQueue.push(packet)
        if (!mseSourceBuffer.updating) {
            pushPacket()
        }
    }

    const getStreamingMSE = () => {
        log('get Streaming MSE...')

        const myUrl = `ws://192.168.8.134:8083/stream/${uuid}/channel/0/mse?uuid=${uuid}&channel=0`;


        startPlay(remoteVideoRef2.current, myUrl);
    }

    const getStreamingHLS = () => {
        log('get Streaming HLS...')

        //const myUrl = `ws://192.168.8.134:8083/stream/${uuid}/channel/0/mse?uuid=${uuid}&channel=0`;

        const videoEl = remoteVideoRef3.current;
        const hlsUrl = `http://192.168.8.134:8083/stream/${uuid}/channel/0/hls/live/index.m3u8`;

        //videoEl.src = hlsUrl

        if (Hls.isSupported()) {
          const hls = new Hls()
          hls.loadSource(hlsUrl)
          hls.attachMedia(videoEl)
        }
        // } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        //   videoEl.src = hlsUrl
        // }


        //startPlay(remoteVideoRef2.current, myUrl);
    }

    useEffect(() => {



    }, []);

    useEffect(() => {

        let id;

        if (peerConnectionError) {

            id = setInterval(getStreaming, 30000);
            setIntervalId(id);
            setPeerConnectionError(false);
        } else {
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

            //getStreaming();

            // timer = setInterval(() => {
            //     getStreaming();
            // }, 10000);

            // setIntervalId(timer);

            getStreaming();

            //getStreamingMSE();

            //getStreamingHLS();


        }

        return () => clearInterval(timer);

    }, [status]);

    useEffect(() => {

        log('remote stream')
        //log(remoteStream)

        if (remoteStream) {
            log('(5) set remote stream ---')
            remoteVideoRef1.current.srcObject = remoteStream;
            remoteVideoRef1.current.play();
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

            {/* <video ref={remoteVideoRef1} width={(fullScreen) ? window.innerWidth : "841px"} height={(fullScreen) ? window.innerHeight : "604px"} autoPlay muted className='my-video-player' onPlaying={myPlaying} onWaiting={myWaitting} onError={myError} allow='fullscreen' >
                Your browser does not support the video tag.
            </video> */}
            <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute',top:0,left:0 }}>
                    <video ref={remoteVideoRef1} width={(fullScreen) ? window.innerWidth : "420px"} height={(fullScreen) ? window.innerHeight : "300px"} autoPlay muted className='my-video-player' onPlaying={myPlaying} onWaiting={myWaitting} onError={myError} allow='fullscreen' >
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div style={{ position: 'absolute',top:0,left:0,fontSize:20,color:'red',paddintLeft:5 }}>
                    &nbsp;&nbsp;Web RTC
                </div>
            </div>


            {
                (videoMessage !== '') &&
                <div style={{ position: 'absolute', top: 0, left: 0, width: 841, height: 604, zIndex: 1, color: '#FFFFFF66' }} className='my-video-message d-flex justify-content-center align-items-center roboto-h5'>
                    <div>
                        {videoMessage}
                    </div>
                </div>
            }

            <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute',top:305,left:0 }}>
                    <video ref={remoteVideoRef2} width={(fullScreen) ? window.innerWidth : "420px"} height={(fullScreen) ? window.innerHeight : "300px"} autoPlay muted className='my-video-player' onPlaying={myPlaying} onWaiting={myWaitting} onError={myError} allow='fullscreen' >
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div style={{ position: 'absolute',top:305,left:0,fontSize:20,color:'red',paddintLeft:5 }}>
                    &nbsp;&nbsp;MSE
                </div>
            </div>

            <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute',top:0,left:420 }}>
                    <video ref={remoteVideoRef3} width={(fullScreen) ? window.innerWidth : "420px"} height={(fullScreen) ? window.innerHeight : "300px"} autoPlay muted className='my-video-player' onPlaying={myPlaying} onWaiting={myWaitting} onError={myError} allow='fullscreen' >
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div style={{ position: 'absolute',top:0,left:420,fontSize:20,color:'red',paddintLeft:5 }}>
                    &nbsp;&nbsp;HLS
                </div>
            </div>



        </div >

    );
};

export default RemoteVideo;
