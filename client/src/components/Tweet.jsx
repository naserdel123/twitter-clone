import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Tweet = ({ tweet, currentUser }) => {
  const [likes, setLikes] = useState(tweet.likes.length);
  const [liked, setLiked] = useState(tweet.likes.includes(currentUser?._id));

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.post(`/tweets/${tweet._id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
    setLikes(res.data.likes.length);
    setLiked(res.data.likes.includes(currentUser._id));
  };

  return (
    <div style={{ border: '1px solid #eee', padding: '1rem', margin: '1rem 0' }}>
      <Link to={`/profile/${tweet.author._id}`}><strong>{tweet.author.username}</strong></Link>
      <p>{tweet.content}</p>
      {tweet.image && <img src={tweet.image} alt="tweet" style={{ maxWidth: '100%' }} />}
      <button onClick={handleLike}>{liked ? 'Unlike' : 'Like'} ({likes})</button>
    </div>
  );
};

export default Tweet;
