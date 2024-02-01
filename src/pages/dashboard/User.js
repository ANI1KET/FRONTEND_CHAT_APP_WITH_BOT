import React, { useEffect, useRef, useState } from 'react'

import { socket } from '../../socket';
import AVRC from './avrc.js';

function User() {
    let localVideoRef = useRef(null);
    let remoteVideoRef = useRef(null);

    const [avrc, setAVRC] = useState();
    const [connected, setConnected] = useState();

    useEffect(() => {
        if (!avrc) {
            let _avrc = new AVRC((stream) => {
                console.log("11111 ", stream);
                remoteVideoRef.current.srcObject = stream;
            });
            _avrc.getConnectionStateChange((change) => {
                setConnected(change);
            });

            setAVRC(_avrc);
        }
    }, []);

    return (
        <div>
            {
                connected ? <h1>Connected</h1> : <h1>Not Connected</h1>
            }
            <h1>Call</h1>

            <video autoPlay ref={localVideoRef} width={400}></video>

            <button onClick={async () => {
                let stream = await avrc?.startLocalStream();
                localVideoRef.current.srcObject = stream;
            }}>
                Start Stream
            </button>

            <video autoPlay ref={remoteVideoRef} width={400}></video>
            <br></br>

            <button onClick={async () => {
                await avrc?.createoffer();
            }}>
                Create Offer
            </button>
        </div>
    )
}

export default User;
