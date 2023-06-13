import React, { useState, useEffect, useRef } from 'react';
import log from "../../utils/console";
import { PropaneSharp } from '@mui/icons-material';

const RemoteVideo = ({ uuid, status,onPlaying }) => {
    const STREAM_SERVER = process.env.REACT_APP_STREAM_SERVER;
    const [remoteStream, setRemoteStream] = useState(null);
    const remoteVideoRef = useRef(null);
    const [videoMessage, setVideoMessage] = useState('Loading...');
    const [intervalId, setIntervalId] = useState(null);


    
    const getStreaming = () => {

        //log('--- remote video start ---')

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
                        sdp: atob(decodeURIComponent(body))
                        //decodeURIComponent
                    }))

                   
            })
            .catch(function (err) {
                log('--- err ---')
                log(err)
            });
        }

        //log("(4) Define Track Event");
        peerConnection.ontrack = function (event) {

            //log('--- track info ---')
            //log(event.streams[0])

            setRemoteStream(event.streams[0]);

            // if (status === 'running') {
            //     setRemoteStream(event.streams[0]);
            // } else {
            //     setRemoteStream(null);
            // }

           
        }
  

    }



    useEffect(() => {

        //setVideoMessage('loading...');
        
        log(`--- status : ${status} ---`)
        let timer=null;

        if (status==='running'){

            //clearTimeout(myTimer);
            //getStreaming();
            timer=setInterval(() => {
                
                getStreaming();

            }, 5000);

            setIntervalId(timer);


        }
            
        return () => clearInterval(timer);
           
    }, [status]);

    useEffect(() => {

        if (remoteStream) {
            //log('--- (5) set remote stream ---')
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
        }
    }, [remoteStream]);


    useEffect(() => {

        if (status === 'set_task_run_loading') {
            setVideoMessage('Loading...');
            onPlaying(false);
        }
        if (status === 'running') {
            //setVideoMessage('');
        }
        if (status === 'stop') {
            setVideoMessage('Switch on the AI task to view inference');
            onPlaying(false);
        }
        if (status === 'set_task_stop_loading') {
            setVideoMessage('Stoping...');
            onPlaying(false);
        }

    }, [status]);

    const myWaitting = () => {
        log('waitting');
        //setVideoMessage('loading...');
    }

    const myPlaying = () => {
        log('playing');
        //setVideoMessage('loading...');
        
        setVideoMessage('');
        clearInterval(intervalId);
        setIntervalId(null);
        onPlaying(true);
    }

    return (
        <div style={{ position: 'relative' }}>

            <video ref={remoteVideoRef} width="839px" height="604px" autoPlay muted className='my-video-player' onPlaying={myPlaying} onWaiting={myWaitting} >
                Your browser does not support the video tag.
            </video>

            {
                (videoMessage !== '') &&
                <div style={{ position: 'absolute', top: 0, left: 0, width: 839, height: 604, zIndex:1, color:'#FFFFFF66'}} className='my-video-message d-flex justify-content-center align-items-center roboto-h5'>
                    <div>
                        {videoMessage}
                    </div>
                </div>
            }
                
            
            
        </div >

    );
};

export default RemoteVideo;
