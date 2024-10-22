import React from 'react'
import '../css/Postdetails.css'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function PostDetail({ item, toggleshow }) {

  const navigate= useNavigate()

  const notifyA = (msg)=> toast.error(msg)
  const notifyB = (msg)=> toast.success(msg)

    const removePost=(postId)=>{
      if(window.confirm("Do really want to delete this post ?")){

        console.log(postId)
        fetch(`/deletePost/${postId}`,{
            method:'delete',
            headers:{
                Authorization: 'Bearer ' +localStorage.getItem('token'),
            }
        })
        .then((res)=>{res.json()})
        .then((result)=>{
            console.log(result)
            toggleshow()
            navigate('/profile')
            notifyB(result.message)
        })
      }
    }

  return (
    <div>
        <div className='showComment'>
        <div className='container'>
          <div className='postPic'>
            <img src={item.photo} alt="" />
          </div>
          <div className="details">
            <div className="card-header">
              <div className="card-pic">
                <img src={item.postedBy.photo} alt="oops" />
              </div>
              <h5 className='profile-name'>{item.postedBy.name}</h5>
              <div className="delete" onClick={()=>{
                removePost(item._id)
                }}>
              <span className="material-symbols-outlined" >delete</span>
              </div>
            </div>
           <div className="comment-section">
            {item.comments.map((comment)=>{
             return (
            <div className='comm'>
              <p className='commenter' style={{fontWeight: 'bold'}}>{comment.postedBy.name}</p>
              <p className='commentText'>{comment.comment}</p>
            </div>
              )
            })}
            
           </div>
            <div className="card-content">
              <p>{item.like.length} Likes</p>
              <p>{item.title}</p>
            </div>
            <div className="add-comment">
              <span className='material-symbols-outlined emoji'>mood</span>
              <input type="text" placeholder='Add message' 
            //   value={comment} onChange={(e) => { setComment(e.target.value) }} 
              />
              <button className="material-symbols-outlined send" 
            //   onClick={()=>{
            //     makeComment(comment, item._id)
            //     toggleComment()
            //   }}
              >send</button>
            </div>
          </div>
        </div>
        <div className="close" 
        onClick={()=>{
          toggleshow()
        }}
        >
        <span class="material-symbols-outlined material-symbols-outlined-close">close</span>
        </div>
      </div>
    </div>
  )
}