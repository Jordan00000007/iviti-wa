import React, { useState, useEffect, useRef } from 'react';
import log from "../../utils/console";

const RemoteVideo = ({ uuid, status }) => {
    const STREAM_SERVER = process.env.REACT_APP_STREAM_SERVER;
    const [remoteStream, setRemoteStream] = useState(null);
    const remoteVideoRef = useRef(null);
    const [videoMessage, setVideoMessage] = useState('Switch on the AI task to view inference');


    useEffect(() => {

        //setVideoMessage('loading...');
        log(`--- status : ${status} ---`)

        // Create RTCPeerConnection
        //log('(1) Create RTCPeerConnection')
        const peerConnection = new RTCPeerConnection({
            iceServers: [{
                urls: ['stun:stun.l.google.com:19302']
            }],
            sdpSemantics: 'unified-plan'
        })

        //log("(2) Add Transceiver");
        peerConnection.addTransceiver('video', { 'direction': 'sendrecv' })

        //log("(3) Define Negotiation");
        peerConnection.onnegotiationneeded = async function handleNegotiationNeeded() {

            //log('(3-1) Create Offer');
            // 建立請求
            const offer = await peerConnection.createOffer()

            // 提供本地端的資訊
            await peerConnection.setLocalDescription(offer);

            //log('(3-2) Trying to Get Remote Request');
            // 使用 http 與 remote 進行請求，需要透過 sdp 去請求

            const trg_url = `${STREAM_SERVER}/stream/${uuid}/channel/0/webrtc`;

            if (status === 'run') {
                fetch(trg_url, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    },
                    body: 'data=' + btoa(offer.sdp)
                })
                    .then((response) => response.text())
                    .then((body) => {
                        peerConnection.setRemoteDescription(
                            new RTCSessionDescription({
                                type: 'answer',
                                sdp: atob(body)
                            }))
                    })
                    .catch(function (err) {
                        log('--- err ---')
                        log(err)
                    });
            }



        }


        //log("(4) Define Track Event");
        peerConnection.ontrack = function (event) {

            if (status === 'run') {
                setRemoteStream(event.streams[0]);
            } else {
                setRemoteStream(null);
            }
        }


    }, [status]);

    useEffect(() => {

        if (remoteStream) {
            //log('--- (5) set remote stream ---')
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
        }
    }, [remoteStream]);


    useEffect(() => {

        if (status==='set_task_run_loading') {
            setVideoMessage('loading...');
        }
        if (status==='run') {
            setVideoMessage('');
        }
        if (status==='stop') {
            setVideoMessage('Switch on the AI task to view inference');
        }
        if (status==='set_task_stop_loading') {
            setVideoMessage('stoping...');
        }
        
    }, [status]);

    const myWaitting=()=>{
        log('waitting');
        //setVideoMessage('loading...');
    }

    const myPlaying=()=>{
        log('playing');
        //setVideoMessage('loading...');
    }

    return (
        <div style={{position:'relative'}}>
            {   (status==='run') &&
                <video ref={remoteVideoRef} width="839px" height="604px" autoPlay muted className='my-video-player' onPlaying={myPlaying} onWaiting={myWaitting} >
                    Your browser does not support the video tag.
                </video>
            }
            {
                (status!=='run') &&
                <div style={{position:'absolute',top: 0,left: 0,width:839 ,height:604,zIndex: 1,color:'#FFFFFF66'}} className='my-video-message d-flex justify-content-center align-items-center roboto-h5'>
                    <div>
                        {videoMessage}
                    </div>
                </div>
            }
            
        </div>

    );
};

export default RemoteVideo;
