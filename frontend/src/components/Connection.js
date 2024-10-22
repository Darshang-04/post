import { useLocation } from 'react-router-dom';
import React from 'react';

export default function Connection() {
  const location = useLocation();
  const { user, posts } = location.state || {}; // Get the passed data
  console.log(user)
  // console.log(posts)
  return (
    <div className='connection-page'>
      <div className='connect'>
        <div className="profile-img">
          <img src={user.photo} alt="" />
        </div>
        <h3>{user.name}</h3>
      </div>
      <hr />
      <div className="request-user">
        <div className='connect'>
          <div className="profile-img">
            <img src={user.photo} alt="" />
          </div>
          <h3>{user.name}</h3>
        </div>
        <div className="">
          <button>Accept</button>
          <button>Deny</button>
        </div>
      </div>
    </div>
  );
}
