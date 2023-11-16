import React, { useState, useEffect, useRef,forwardRef,useImperativeHandle } from 'react';
import log from "../../utils/console";
import { Buffer } from "buffer";
import { PropaneSharp } from '@mui/icons-material';
import Hls from 'hls.js';


//= forwardRef((props, ref) => {


const RemoteVideo = forwardRef(({ uuid, status, onPlaying, fullScreen, onError },ref) => {
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
            remoteVideoRef1.current.style="outline: 5px solid #E61F23CC !important;outline-offset: -6px !important;"
        },
        setBorderOff: () => {
            remoteVideoRef1.current.style="outline: 0px;";
        }
      }));

    const getStreaming = () => {

        log('--- remote video start (web rtc) ---')

        log('(1) Create RTCPeerConnection')
        const peerConnection = new RTCPeerConnection({
            iceServers: [
                {
                    urls: ['stun:stun.l.google.com:19302']
                },
                {
                    urls: ['turn:192.168.8.134:3478'],
                    username:'turnguest',
                    credential:'turnguestpass',
                },
            ],

           
            sdpSemantics: 'unified-plan'
        })

        //const peerConnection = new RTCPeerConnection()

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
                        onPlaying(false);
                        onError(myBody.payload);
                        //onError('WebRTC connection failed, transfer to MSE streaming');
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
                    setPeerConnectionError(true);
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

            // if (e.currentTarget.iceConnectionState === 'disconnected') {
            //     setPeerConnectionError(true);
            //     log('peerConnection')
            // }

            // if (e.currentTarget.iceConnectionState === 'connected') {
            //     setPeerConnectionError(false);
            // }


        };


    }

    const getStreaming2 = () => {

        const videoEl=remoteVideoRef1.current;

        const url = `${STREAM_SERVER}/stream/${uuid}/channel/0/webrtc`;

        const webrtc = new RTCPeerConnection({
          iceServers: [{
            urls: ['stun:stun.l.google.com:19302']
          },
          {
            urls: ['turn:192.168.8.134:3478?transport=udp'],
            username: 'turnguest',
            credential: 'turnguestpass',
        }
        ],
        //iceServers:[],
          sdpSemantics: 'unified-plan'
        })
        webrtc.ontrack = function (event) {
          console.log(event.streams.length + ' track is delivered')
          videoEl.srcObject = event.streams[0]
          videoEl.play()
        }
        webrtc.addTransceiver('video', { direction: 'sendrecv' })
        webrtc.onnegotiationneeded = async function handleNegotiationNeeded () {

            const offer = await webrtc.createOffer()

            await webrtc.setLocalDescription(offer)

            // log('--- sdp ---')
            // log(btoa(webrtc.localDescription.sdp))
      
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
                  console.warn(e)
                  //getStreaming2();
                  setPeerConnectionError(true);
                }
              })

        }
    
        // const webrtcSendChannel = webrtc.createDataChannel('rtsptowebSendChannel')
        // webrtcSendChannel.onopen = (event) => {
        //   console.log(`${webrtcSendChannel.label} has opened`)
        //   webrtcSendChannel.send('ping')
        // }
        // webrtcSendChannel.onclose = (_event) => {
        //   console.log(`${webrtcSendChannel.label} has closed`)
        //   getStreaming2(videoEl, url)
        // }
        // webrtcSendChannel.onmessage = event => console.log(event.data)
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

        const myUrl = `${STREAM_SERVER.replace("http://","ws://")}/stream/${uuid}/channel/0/mse?uuid=${uuid}&channel=0`;


        startPlay(remoteVideoRef1.current, myUrl);
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

  

    // useEffect(() => {

    //     let id;

    //     if (peerConnectionError) {
    //         log('connect fail, try again....')
    //        // id = setInterval(getStreaming, 5000);
    //         //setIntervalId(id);

    //         getStreaming();
    //         setPeerConnectionError(false);
    //     } else {
    //         log('clear interval id')
    //         clearInterval(id);
    //     }

    //     return () => clearInterval(intervalId);

    // }, [peerConnectionError]);

    useEffect(() => {

        log('peerConnectionError',peerConnectionError)

        if (peerConnectionError) {
           
            getStreamingMSE();
            setPeerConnectionError(false);
        } 

    }, [peerConnectionError]);


    useEffect(() => {

        //setVideoMessage('loading...');

        log(`--- status : ${status} ---`)
        let timer = null;

        if (status === 'run') {
         
            getStreaming2();

        }else{
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
