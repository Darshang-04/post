import React, { useEffect, useState } from 'react'
import { json, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import '../css/Home.css'
import { Link } from 'react-router-dom';
// import { post } from '../../../backend/routes/createPost';

export default function Myfollowing() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);

  const notifyA =(msg)=> toast.success(msg)
  const notifyB =(msg)=> toast.error(msg)

  const toggleComment=(post)=>{
    if(show){
      setShow(false)
    }else{
      setShow(true)
      setItem(post)
      console.log(item)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate('/signin')
    }

    fetch("/myfollowingpost", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
    }).then(res => res.json())
      .then(result => {
        // console.log(result)
        setData(result)
      })
      .catch(err => console.log(err))

  }, [data, comment])

  const likePost = (id) => {
    fetch('/likes', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((post) => {
          if (post._id == result._id) {
            return result;
          } else {
            return post;
          }
        });
        setData(newData);
        // console.log(result);
      });
      }

  const unlikePost = (id) => {
    fetch('/unlikes', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) =>res.json())
      .then((result) => {
        const newData = data.map((post) => {
          if (post._id == result._id) {
            return result;
          } else {
            return post;
          }
        });
        setData(newData);
        // console.log(result);
      });
      }

  const makeComment = (text, id) => {
    fetch('/comment', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({
        text: text,
        postId: id,
      })
    })
      .then((res) => res.json())
      .then((result) => { 
        const newData = data.map((post) => {
          if (post._id === result._id) { 
            return result
          }
          else {
            return post
          }
        })
        setData(newData)
        setComment("")
        notifyA("Comment posted!")
      })
  }

  return (
    <div className="main">
      {data.map((post) => {
        return (
          <>
            <div className='card'>
              <div className="card-header">
                <div className="card-pic">
                  <img src="https://th.bing.com/th/id/OIP.SAcV4rjQCseubnk32USHigHaHx?rs=1&pid=ImgDetMain" alt="oops" />
                </div>
                <h5 className='profile-name'>
                  <Link to={`/profile/${post.postedBy._id}`}>
                  {post.postedBy.name}
                  </Link>
                </h5>
              </div>
              <div className="card-image">
                <div className="img-size">
                  <img src={post.photo} alt="oops" srcset="" />
                </div>
              </div>
              <div className="card-content">
                <div className='like'>
                  {post.like.includes(JSON.parse(localStorage.getItem('user'))._id)
                  ?(
                    <span class="material-symbols-outlined material-symbols-outlined-red" onClick={() => { unlikePost(post._id) }}>favorite</span>
                  ):(
                    <span class="material-symbols-outlined" onClick={() => { likePost(post._id) }}>favorite</span>
                  )}

                  <p className='no-like'>{post.like.length}Like</p>
                  <span class="material-symbols-outlined add">person_add</span>
                </div>
                <p style={{cursor:'pointer'}} onClick={()=>{toggleComment(post)}}>View all comments</p>
                <h3 className="book-name">{post.title}</h3>
                <div className="book-week">
                  <p>per week ₹.00</p>
                  <p className="week-charge"> 00</p>
                </div>
              </div>
              <div className="add-comment">
                <span className='material-symbols-outlined emoji'>mood</span>
                <input type="text" placeholder='Add message' value={comment} onChange={(e) => { setComment(e.target.value) }} />
                <button className="material-symbols-outlined send" onClick={() => { makeComment(comment, post._id) }}>send</button>
              </div>
            </div>
          </>
        )
      })}
      {show && (
      <div className='showComment'>
        <div className='container'>
          <div className='postPic'>
            <img src={item.photo} alt="" />
          </div>
          <div className="details">
            <div className="card-header">
              <div className="card-pic">
                <img src={item.photo} alt="oops" />
              </div>
              <h5 className='profile-name'>{item.postedBy.name}</h5>

            </div>
           <div className="comment-section">
            {item.comments.map((comment)=>{
             return (
            <div className='comm'>
              <p className='commenter' style={{fontWeight: 'bold'}}>{item.postedBy.name}</p>
              <p className='commentText'>{comment.comment}</p>
            </div>
              )
            })}
            
           </div>
            <div className="card-content">
              <p>{item.like.length} Likes</p>
              <p>{item.body}</p>
            </div>
            <div className="add-comment">
              <span className='material-symbols-outlined emoji'>mood</span>
              <input type="text" placeholder='Add message' value={comment} onChange={(e) => { setComment(e.target.value) }} />
              <button className="material-symbols-outlined send" onClick={()=>{
                makeComment(comment, item._id)
                toggleComment()
              }}>send</button>
            </div>
          </div>
        </div>
        <div className="close" onClick={()=>{
          toggleComment()
        }}>
        <span class="material-symbols-outlined material-symbols-outlined-close">close</span>
        </div>
      </div>)}
    </div>
    
  )
}
