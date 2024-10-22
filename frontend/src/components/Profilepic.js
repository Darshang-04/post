import React from 'react'
import { useRef, useState, useEffect } from 'react'
import '../css/ProfilePic.css'

export default function Profilepic({changeProfilePic}) {
const [title, setTitle] = useState("");
const [image, setImage] = useState("");
const [url, setUrl] = useState("");
// const [process, setProcess] = useRef(false)
const [imageUploaded, setImageUploaded] = useState(false);

    const handleFile= useRef(null)

    const postData = () => {
        const data = new FormData()
        data.append('file',image)
        data.append("upload_preset","bookexchange")
        data.append("cloud_name","okcloud")
        fetch("https://api.cloudinary.com/v1_1/okcloud/image/upload",
            {
                method:"post",
                body:data
            })
            .then(res=>res.json())
            .then(data=>setUrl(data.url))
            .catch(err=>console.log(err))
        console.log(url)
    }

    const profilepicurl=()=>{
        fetch('/uploadprofilepic', {
            method: 'put',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify({
              pic:url
            }),
          })
            .then((res) =>res.json())
            .then((data) =>{
                console.log(data)
                changeProfilePic()
                window.location.reload()
                
            })
            .catch(err=>console.log(err))
    }

    const handleClick =()=>{
        handleFile.current.click()
    }

    useEffect(()=>{
        if(image){
            postData()
            setImageUploaded(true)
        }
    },[image])

    useEffect(()=>{
        if(url){
            profilepicurl() 
        }
    },[url])
   
  return (
    <div className='profilepic darkBg'>
        {(imageUploaded) ? (<div className='process-bar'>
            <div className='process'>
                 
            </div>
        </div>) : (
            <div className="changePic centered">
            <div>
                <h1>Change Profile Photo</h1>
            </div>
            <div style={{borderTop:'1px solid #00000030'}}>
                <button className='uploadbtn' style={{color: "#1EA1F7"}} onClick={handleClick}>Upload </button>
                <input type="file" ref={handleFile} accept='image/*' onChange={(e)=>{
                    setImage(e.target.files[0])
                }} style={{display: "none"}} /> 
            </div>
            <div style={{borderTop:'1px solid #00000030'}}>
                <button className='uploadbtn' style={{color: 'red '}} onClick={()=>{
                    setUrl(null);
                    profilepicurl()
                }}>Remove Photo</button>
            </div>
            <div style={{borderTop:'1px solid #00000030'}}>
                <button className='uploadbtn' style={{}} onClick={changeProfilePic}>Cancel</button>
            </div>
            
        </div>
        )}
        
    </div>
  )
}
