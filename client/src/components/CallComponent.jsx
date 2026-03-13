import React, { useRef, useEffect, useState } from 'react';
import Peer from 'simple-peer';
import socket from '../socket';

const CallComponent = ({ userId, targetUserId }) => {
  const [stream, setStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });

    socket.on('incoming-call', ({ signal, from }) => {
      const peer = new Peer({ initiator: false, trickle: false, stream });
      peer.on('signal', (data) => {
        socket.emit('accept-call', { signal: data, to: from });
      });
      peer.on('stream', (remoteStream) => {
        userVideo.current.srcObject = remoteStream;
        setCallAccepted(true);
      });
      peer.signal(signal);
      connectionRef.current = peer;
    });

    socket.on('call-accepted', (signal) => {
      setCallAccepted(true);
      connectionRef.current.signal(signal);
    });

    return () => {
      socket.off('incoming-call');
      socket.off('call-accepted');
    };
  }, []);

  const callUser = () => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on('signal', (data) => {
      socket.emit('call-user', { userToCall: targetUserId, signal: data, from: userId });
    });
    peer.on('stream', (remoteStream) => {
      userVideo.current.srcObject = remoteStream;
    });
    connectionRef.current = peer;
  };

  const endCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload(); // تبسيطاً
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <video playsInline muted ref={myVideo} autoPlay style={{ width: '200px' }} />
        {callAccepted && !callEnded && (
          <video playsInline ref={userVideo} autoPlay style={{ width: '200px' }} />
        )}
      </div>
      <div>
        {!callAccepted ? (
          <button onClick={callUser}>Call</button>
        ) : (
          <button onClick={endCall}>End Call</button>
        )}
      </div>
    </div>
  );
};

export default CallComponent;
