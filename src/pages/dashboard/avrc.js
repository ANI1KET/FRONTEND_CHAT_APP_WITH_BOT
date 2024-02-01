import { socket } from '../../socket';

class AVRC {
    conncetion;
    localStream;
    remoteStream;

    constructor(callbackFunction) {
        this.conncetion = new RTCPeerConnection({
            iceServers: [
                {
                    urls: ['stun:stun.l.google.com:19302'],
                },
            ],
        });

        this.remoteStream = new MediaStream();

        this.conncetion.ontrack = (event) => {
            if (event.streams[0]) {
                console.log("00000 ", event.streams[0]);
                callbackFunction(event.streams[0]);
            }
        }

        this.conncetion.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice_candidate', event.candidate);
            }
            else {
                throw new Error('No Ice Candidate Found');
            }
        }

        socket.on("answer", async (answer) => {
            try {
                let rtc_session_description = new RTCSessionDescription(answer);
                await this.conncetion?.setRemoteDescription(rtc_session_description);
            } catch (error) {
                throw error;
            }
        })

        socket.on("offer", async (offer) => {
            try {
                const rtc_session_description = new RTCSessionDescription(offer);
                await this.conncetion?.setRemoteDescription(rtc_session_description);

                let answer = await this.conncetion?.createAnswer();
                await this.conncetion?.setLocalDescription(answer);

                socket.emit('answer', answer);
            } catch (error) {
                throw error;
            }
        })

        socket.on('ice_candidate', async (ice_candidate) => {
            try {
                await this.conncetion?.addIceCandidate(ice_candidate);
            } catch (error) {
                throw error;
            }
        });
    }

    async createoffer() {
        try {
            let offer = await this.conncetion?.createOffer();
            await this.conncetion?.setLocalDescription(offer);

            // socket.on('ice_candidate', async (ice_candidate) => {
            //     try {
            //         await this.conncetion?.addIceCandidate(ice_candidate);
            //     } catch (error) {
            //         throw error;
            //     }
            // });

            socket.emit('offer', offer);
        } catch (error) {
            throw error;
        }
    }
 
    async startLocalStream() {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            this.localStream.getTracks().forEach((track) => {
                this.conncetion?.addTrack(track, this.localStream);
            })

            return this.localStream;
        } catch (error) {
            throw error;
        }
    }

    async getConnectionStateChange(fun) {
        this.conncetion.onconnectionstatechange = () => {
            fun(this.conncetion.connectionState === 'connected');
        }
    }
}

export default AVRC;




// import React, { useEffect, useRef } from 'react'
// import { useState } from 'react';

// import { socket } from '../../socket';

// function User() {
//     let playerRef = useRef();

//     const [peerConnection, setPeerConnection] = useState();
//     const [connected, setConnected] = useState(false);


//     useEffect(() => {
//         let localStreeam;
//         let remoteStream;

//         const _peerConnection = new RTCPeerConnection({
//             'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }]
//         });

//         remoteStream = new MediaStream();

//         socket.on("answer", async (answer) => {
//             try {
//                 let rtc_session_description = new RTCSessionDescription(answer);
//                 await _peerConnection.setRemoteDescription(rtc_session_description)
//             } catch (err) {
//                 console.log(err);
//             }
//         })

//         socket.on("offer", async (offer) => {
//             try {
//                 const rtc_session_description = new RTCSessionDescription(offer);
//                 _peerConnection.setRemoteDescription(rtc_session_description);

//                 let answer = await _peerConnection.createAnswer();
//                 await _peerConnection.setLocalDescription(answer);

//                 socket.emit('answer', answer);
//             } catch (err) {
//                 console.log("ERROR", err);
//             }
//         })

//         socket.on('ice_candidate', async (ice_candidate) => {
//             try {
//                 await _peerConnection.addIceCandidate(ice_candidate);
//             } catch (err) {
//                 console.log(err);
//             }
//         });

//         _peerConnection.ontrack = (event) => {
//             if (event.streams[0]) {
//                 event.streams[0].getAudioTracks().forEach(track => {
//                     remoteStream.addTrack(track);
//                 })
//             }
//         }

//         _peerConnection.onicecandidate = (e) => {
//             if (e.candidate) {
//                 socket.emit('ice-canditat', e.candidate);
//             }
//             else {
//                 throw new Error('No Ice Candidate Found');
//             }
//         }

//         const startLocalStream = async () => {
//             try {
//                 localStreeam = await navigator.mediaDevices.getUserMedia({
//                     video: true,
//                     audio: true
//                 })
//                 if (peerConnection) {
//                     localStreeam.getTracks().forEach((track) => {
//                         peerConnection.addTrack(track, localStreeam)
//                     });
//                 }
//             } catch (err) {
//                 console.log(err);
//             }
//         }

//         const getLocalStream = async () => {
//             return localStreeam;
//         }

//         const createoffer = async () => {
//             try {
//                 let offer = await _peerConnection?.createOffer();
//                 _peerConnection?.setLocalDescription(offer);
//                 socket.emit('offer', offer);
//             } catch (err) {
//                 console.log("Error");
//             }
//         }
//     });

//     // useEffect(async () => {
//     //     const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
//     //     const _peerConnection = new RTCPeerConnection(configuration);

//     //     _peerConnection.addEventListener('connectionstatechange', (event) => {
//     //         if (_peerConnection.connectionState === 'connected') {
//     //             setConnected(_peerConnection.connectionState === 'connected');
//     //         }
//     //     });

//     //     _peerConnection.addEventListener('icecandidate', (event) => {
//     //         if (event.candidate) {
//     //             socket.emit('new-ice-candidate', { icecandidate: event.candidate });
//     //         }
//     //     });

//     //     socket.on("message", async (message) => {
//     //         console.log("0 ", message);
//     //         if (message.answer) {
//     //             const remoteDesc = new RTCSessionDescription(message.answer);
//     //             await _peerConnection.setRemoteDescription(remoteDesc)
//     //         }

//     //         if (message.offer) {
//     //             const remoteDesc = new RTCSessionDescription(message.offer);
//     //             await _peerConnection.setRemoteDescription(remoteDesc);
//     //             const answer = await _peerConnection.createAnswer();
//     //             await _peerConnection.setLocalDescription(answer);
//     //             socket.emit('answer', { answer });
//     //         }

//     //         if (message.iceCandidate) {
//     //             try {
//     //                 await _peerConnection.addIceCandidate(message.iceCandidate);
//     //             } catch (err) {
//     //                 console.log(err);
//     //             }
//     //         }
//     //     })

//     //     peerConnection.addEventListener('track', async (event) => {
//     //         const [remoteStream] = event.streams;
//     //         playerRef.current.srcObject = remoteStream;
//     //     });

//     //     setPeerConnection(_peerConnection);

//     //     return () => {
//     //         socket?.off('message');
//     //     }
//     // }, []);

//     // let makeCall = async () => {
//     //     if (peerConnection) {
//     //         const offer = await peerConnection.createOffer();
//     //         await peerConnection.setLocalDescription(offer);
//     //         socket.emit('offer', { offer });
//     //     }
//     // };

//     // const startStreaming = async () => {
//     //     let stream = await navigator.mediaDevices.getUserMedia({
//     //         video: true,
//     //         audio: true
//     //     })
//     //     // .then(stream => {
//     //     //     if (playerRef.current) {
//     //     //         playerRef.current.srcObject = stream;
//     //     //     }
//     //     // })
//     //     if (peerConnection) {
//     //         stream.getTracks().forEach((track) => {
//     //             peerConnection.addTrack(track, stream)
//     //         });
//     //     }
//     // };

//     return (
//         <div>
//             {
//                 connected ? "Connected" : "Disconnected"
//             }
//             <br />
//             {/* <button onClick={() => startStreaming()}>Start streaming</button> */}
//             <br />
//             <video ref={playerRef} autoPlay={true} controls={true}></video>
//             <br />
//             {/* <button type='primary' onClick={() => makeCall()}> */}
//             {/* Make_Call */}
//             {/* </button> */}
//         </div >
//     )
// }

// export default User;
