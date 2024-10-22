import React, {useEffect, useState} from 'react'
import logo from '../img/welcomecut.jfif'
import '../css/Signup.css'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
// import { notify } from '../../../backend/routes/auth';

export default function() {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const emailcheck = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    const passwordcheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

    const notifyE=(msg)=>toast.error(msg);
    const notifyS=(msg)=>toast.success(msg);

    const postData=()=>{
        if(!emailcheck.test(email)){
            notifyE("Invalid Email")
            return
        }else if(!passwordcheck.test(password)){
            notifyE("Password must containe 8 alphanumeric and special symbol")
            return
        }
        fetch("/signup", {
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name,
                username:username,
                email:email,
                password:password
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                notifyE(data.error ) 
            }else{
                notifyS(data.message)
                navigate('/signin')
            }
            // console.log(data)
        })
    }

  return (
    <div className='Signup'>
        <div className="form-container">
            <div className="form">
            <img className='signinlogo' src={logo} alt="" />
            <p className='loginpara'>Signin to see Photos and video </p>
            <div>
                <input type="email" name="email" id="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder='enter your email' />
            </div>
            <div>
                <input type="text" name="name" id="name" value={name} onChange={(e)=>{setName(e.target.value)}} placeholder='enter your full name' />
            </div>
            <div>
                <input type="text" name="username" id="username" value={username} onChange={(e)=>{setUsername(e.target.value)}} placeholder='enter your username' />
            </div>
            <div>
                
                <input type="password" name="password" id="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder='enter your password' />
            </div>
            <p className="loginpara">
                if you have already account? <Link to="/signin"><span>Sign in</span></Link>
            </p>
            <input type="submit" id='submit' onClick={()=>{postData()}} value="Sign Up" />
            </div>
        </div>
    </div>
  )
}
