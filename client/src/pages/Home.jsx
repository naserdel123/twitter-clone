import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tweet from '../components/Tweet';
import CallComponent from '../components/CallComponent';

const Home = ({ user }) => {
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState('');
  const [showCall, setShowCall] = useState(false);
  const [callWith, setCallWith] = useState(null);

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    const res = await axios.get('/tweets');
    setTweets(res.data);
  };

  const postTweet = async () => {
    if (!content.trim()) return;
    const token = localStorage.getItem('token');
    const res = await axios.post('/tweets', { content }, { headers: { Authorization: `Bearer ${token}` } });
    setTweets([res.data, ...tweets]);
    setContent('');
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, padding: '1rem' }}>
        <h2>Home</h2>
        <div>
          <textarea value={content} onChange={e => setContent(e.target.value)} maxLength={280} rows="3" cols="50" />
          <button onClick={postTweet}>Tweet</button>
        </div>
        <div>
          {tweets.map(tweet => <Tweet key={tweet._id} tweet={tweet} currentUser={user} />)}
        </div>
      </div>
      <div style={{ width: '300px', padding: '1rem', borderLeft: '1px solid #ccc' }}>
        <h3>Call a user</h3>
        <input type="text" placeholder="User ID" onChange={e => setCallWith(e.target.value)} />
        <button onClick={() => setShowCall(true)}>Start Call</button>
        {showCall && callWith && (
          <CallComponent userId={user._id} targetUserId={callWith} />
        )}
      </div>
    </div>
  );
};

export default Home;
