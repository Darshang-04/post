import React, { useState , useEffect} from 'react'
import "../css/Createpost.css"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Createpost() {

const [title, setTitle] = useState("");
const [image, setImage] = useState("");
const [url, setUrl] = useState("");

const notifyE=(msg)=>toast.error(msg);
const notifyS=(msg)=>toast.success(msg);
const navigate=useNavigate()

useEffect(()=>{
    if(url){
        fetch("/createpost",
            {
                method:'post',
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("token")
                },
                body: JSON.stringify(
                    {
                    title,
                    pic:url
                    })
            }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                    notifyE("Not posted")
                }
                else{
                    notifyS("Book posted successfully!!")
                    navigate('/')
                }
            })
            .catch(err=>console.log(err))
    }
},[url])

const postData = () => {
    console.log(title,image)
    const data = new FormData()
    data.append('file',image)
    data.append("upload_preset","bookexchange")
    data.append("cloud_name","okcloud")
    fetch("https://api.cloudinary.com/v1_1/okcloud/image/upload",
        {
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>setUrl(data.url))
        .catch(err=>console.log(err))
}

    const loadFile = (event) =>{
        var output = document.getElementById('output');
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function() {
            URL.revokeObjectURL(output.src);
        }
    }
  return (
    <div className='createPost'>
        <div className="post-header">
            <h4 style={{margin:"3px auto"}}>Create New Post</h4>
            <button id='post-btn' onClick={()=>{postData()}}>Upload</button>
        </div>
        <div className="main-div"> 
            <img id='output' src='https://sciendo.com/product-not-found.png'/>
            <input type='file' accept='image/*' onChange={(event)=>{loadFile(event);
            setImage(event.target.files[0])
            }}/>
        </div>
        <div className="details">
            <div className="card-header">
                <div className="card-pic">
                <img src="https://th.bing.com/th/id/OIP.SAcV4rjQCseubnk32USHigHaHx?rs=1&pid=ImgDetMain" alt="oops" />
                </div>
                <h5>Description</h5>
            </div>
            <textarea value={title} onChange={(e)=>{setTitle(e.target.value)}} type='text' placeholder='write a caption...'></textarea>
        </div>
    </div>
  )
}
