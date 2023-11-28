import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import log from "../../utils/console";
import { Buffer } from "buffer";
import { PropaneSharp } from '@mui/icons-material';
import Hls from 'hls.js';
import isOnline from 'is-online';


//= forwardRef((props, ref) => {


const RemoteVideo = forwardRef(({ uuid, status, onPlaying, fullScreen, onError }, ref) => {
    const STREAM_SERVER = process.env.REACT_APP_STREAM_SERVER;
    const [remoteStream, setRemoteStream] = useState(null);
    //const remoteVideoRef = useRef(null);
    const remoteVideoRef1 = useRef(null);
    const remoteVideoRef2 = useRef(null);
    const remoteVideoRef3 = useRef(null);
    const [videoMessage, setVideoMessage] = useState('Loading...');
    const [intervalId, setIntervalId] = useState(null);
    const [peerConnectionError, setPeerConnectionError] = useState(false);

   


    useImperativeHandle(ref, () => ({

        setBorderOn: () => {
            //remoteVideoRef1.current.style="box-shadow:0px 0px 0px 10px blue inset;";
            remoteVideoRef1.current.style = "outline: 5px solid #E61F23CC !important;outline-offset: -6px !important;"
        },
        setBorderOff: () => {
            remoteVideoRef1.current.style = "outline: 0px;";
        }
    }));

   
    const getStreamingWebRTC = () => {

        const videoEl = remoteVideoRef1.current;

        const url = `${STREAM_SERVER}/stream/${uuid}/channel/0/webrtc`;

        const webrtc = new RTCPeerConnection({
            iceServers: [
                {
                    urls: ['stun:stun.l.google.com:19302']
                },
                // {
                //     urls: ['turn:innotest:3478'],
                //     username: 'turnguest',
                //     credential: 'turnguestpass',
                // }
            ],
            //iceServers:[],
            sdpSemantics: 'unified-plan'
        })
        webrtc.ontrack = function (event) {
            videoEl.srcObject = event.streams[0]
            videoEl.play()
        }
        webrtc.addTransceiver('video', { direction: 'sendrecv' })
        webrtc.onnegotiationneeded = async function handleNegotiationNeeded() {

            const offer = await webrtc.createOffer()
            await webrtc.setLocalDescription(offer)
            fetch(url, {
                method: 'POST',
                body: new URLSearchParams({ data: btoa(webrtc.localDescription.sdp) })
            })
                .then(response => response.text())
                .then(data => {
                    try {
                        webrtc.setRemoteDescription(
                            new RTCSessionDescription({ type: 'answer', sdp: atob(data) })
                        )
                    } catch (e) {
                        setPeerConnectionError(true);
                    }
                })

        }

      
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

    const getStreamingMSE = () => {
        log('get Streaming MSE...')

        if (STREAM_SERVER===""){
            //正式環境
            const myUrl = `ws://${window.location.hostname}:8083/stream/${uuid}/channel/0/mse?uuid=${uuid}&channel=0`;
            log(myUrl)
            startPlay(remoteVideoRef1.current, myUrl);

        }
        else
        {      
            //開發環境
            let myUrl = `${STREAM_SERVER.replace("http://", "ws://")}/${(STREAM_SERVER==="")?"wsstream":"stream"}/${uuid}/channel/0/mse?uuid=${uuid}&channel=0`;
            log(myUrl)
            startPlay(remoteVideoRef1.current, myUrl);


        }


    }


    const startPlay = (videoEl, url) => {
        
        videoEl.pause();
        videoEl.currentTime =0;
        videoEl.srcObject =null;
       

        const mse = new MediaSource()

        log('mse')
        log(mse)


        videoEl.src = window.URL.createObjectURL(mse)
        mse.addEventListener('sourceopen', function () {
            const ws = new WebSocket(url)
            log('try ws connect...')

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

        videoEl.load();
    }

    const pushPacket = () => {

        //const videoEl = document.querySelector('#mse-video')
        const videoEl = remoteVideoRef1.current
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

    useEffect(() => {

        log('peerConnectionError', peerConnectionError)

        if (peerConnectionError) {

            getStreaming();
            setPeerConnectionError(false);
        }

    }, [peerConnectionError]);

    const getStreaming=async ()=>{
        const myOnline=await isOnline();
        if (myOnline){
            log('online...')
            getStreamingWebRTC();
            
        }else{
            log('offline...')
            getStreamingMSE();
        }
    }


    useEffect(() => {

        //setVideoMessage('loading...');

        log(`--- status : ${status} ---`)
        let timer = null;

        if (status === 'run') {

            getStreaming();

        } else {
            setPeerConnectionError(false);
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

            <video ref={remoteVideoRef1} width={(fullScreen) ? window.innerWidth : "841px"} height={(fullScreen) ? window.innerHeight : "604px"} autoPlay muted className='my-video-player' onPlaying={myPlaying} onWaiting={myWaitting} onError={myError} allow='fullscreen' >
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
});

export default RemoteVideo;
