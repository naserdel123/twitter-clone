import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Tweet from '../components/Tweet';

const Profile = ({ currentUser }) => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchTweets();
  }, [id]);

  const fetchUser = async () => {
    const res = await axios.get(`/users/${id}`); // تحتاج إضافة route
    setUser(res.data);
  };

  const fetchTweets = async () => {
    const res = await axios.get(`/tweets/user/${id}`); // تحتاج إضافة route
    setTweets(res.data);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>{user.username}</h2>
      <p>{user.bio}</p>
      <div>Followers: {user.followers?.length}</div>
      <div>Following: {user.following?.length}</div>
      <hr />
      <h3>Tweets</h3>
      {tweets.map(tweet => <Tweet key={tweet._id} tweet={tweet} currentUser={currentUser} />)}
    </div>
  );
};

export default Profile;
