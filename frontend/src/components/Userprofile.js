import React, { useState, useEffect } from 'react';
import '../css/Profile.css';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function UserProfile() {
  const defaultpic = "https://th.bing.com/th/id/OIP.SAcV4rjQCseubnk32USHigHaHx?rs=1&pid=ImgDetMain";
  const { userid } = useParams();

  const [user, setUser] = useState("");
  const [post, setPost] = useState([]);
  const [isFollow, setIsFollow] = useState(false);

  // Fetch user and post data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/user/${userid}`, {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        });
        const result = await res.json();
        
        setUser(result.user);
        setPost(result.post || []);
        
        if (result.user.followers.includes(JSON.parse(localStorage.getItem("user"))._id)) {
          setIsFollow(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [userid, isFollow]);

  // Function to follow a user
  const followUser = async (userId) => {
    try {
      const res = await fetch('/follow', {
        method: "PUT",
        headers: {
          "Content-Type": 'application/json',
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          followId: userId,
        }),
      });
      const data = await res.json();
      console.log(data);

      setIsFollow(true);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  // Function to unfollow a user
  const unfollowUser = async (userId) => {
    try {
      const res = await fetch('/unfollow', {
        method: "PUT",
        headers: {
          "Content-Type": 'application/json',
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          followId: userId,
        }),
      });
      const data = await res.json();
      console.log(data);

      setIsFollow(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <div className="profile">
      <div className="profile-frame">
        <div className="profile-pic">
          <img src={user.photo ? user.photo : defaultpic} alt="Profile" />
        </div>
        <div className="profile-data">
          <h1>{user.name}</h1>
          <div style={{ display: "flex", alignItems: "center" }}>
            <p className='posts'>{post.length} Posts</p>
            <button
              className='followbtn'
              onClick={() => {
                isFollow ? unfollowUser(user._id) : followUser(user._id);
              }}
            >
              {isFollow ? "Unfollow" : "Follow"}
            </button>
            <button className='followbtn' style={{ color: "white" }}>
              Following
            </button>
          </div>
          <div className="profile-info">
            <p>Posts</p>
            <p>{user.followers ? user.followers.length : "0"} Followers</p>
            <p>{user.following ? user.following.length : "0"} Following</p>
          </div>
        </div>
      </div>
      <hr
        style={{
          width: "100%",
          margin: "25px auto",
          opacity: "0.8",
        }}
      />
      <div className="gallery">
        {post.length > 0 ? (
          post.map((pics) => (
            <img key={pics._id} src={pics.photo} alt="Post" />
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  );
}
