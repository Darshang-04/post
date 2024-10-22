import React, {useState, useEffect} from 'react'
import '../css/Profile.css'
import { Link } from 'react-router-dom'

import PostDetail from '../components/PostDetail'
import Profilepic from '../components/Profilepic'
import Connection from '../components/Connection'


export default function Profile() {
  const defaultpic = "https://th.bing.com/th/id/OIP.SAcV4rjQCseubnk32USHigHaHx?rs=1&pid=ImgDetMain"
  const [pic, setPic]= useState([])
  const [show, setShow]= useState(false)
  const [posts, setPosts]= useState([])
  const [user,setUser] = useState("")
  const [changePic, setChangePic]= useState(false)

  const toggleshow=(posts)=>{
    if(show){
      setShow(false)
    }else{
      setShow(true)
      setPosts(posts)
    }
  }

  useEffect(()=>{
    fetch(`/user/${JSON.parse(localStorage.getItem("user"))._id}`,{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("token")
      },
    }).then(res=>res.json())
    .then(result=>{
      // console.log(result)
      setPic(result.post)
      setUser(result.user)
      // console.log(pic)
    })

  },[])

  const ChangeProfile=()=>{
    if(changePic){
      setChangePic(false)
    }else{
      setChangePic(true)
    }
  }

  useEffect(()=>{
    fetch('/userpost',{
      method:"get",
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("token")
      },
    }).then(res=>res.json())
    .then(result=>{
      setPic(result)
    })
    .catch(err=>console.log(err))
  })

  return (
    <>
    <div className='profile'>
      <div className="profile-frame">
        <div className="profile-pic">
          <img 
          onClick={ChangeProfile} 
          src={user.photo ? user.photo : defaultpic} alt="oops" />
        </div>
        <div className="profile-data">
          <h1>{JSON.parse(localStorage.getItem('user')).name}</h1>
          <div className="profile-info">
            <p>{pic ? pic.length : "0"} post</p>
            <p>{user.followers ? user.followers.length : "0"} followers</p>
            <p>{user.following ? user.following.length : "0"} following</p>
          </div>
        </div>
      </div>
      <hr style={{
        width:"100%",
        margin:"25px auto",
        opacity:"0.8"
        }}/>
      <div className="gallery">
      {pic.map((pics)=>{
        return <img src={pics.photo} onClick={()=>{toggleshow(pics)}}></img>
      })}   
      
      {show && 
      <PostDetail item={posts}  toggleshow={toggleshow}/>
      }
      {
        changePic && 
        <Profilepic changeProfilePic={ChangeProfile}/>
      }
      
    </div>
    </div>
      <div className="connection_div">
        <Link to='/connection' state={{ user: user, posts: pic }}>Connection
        </Link>
      </div>
      </>
  )
}