import React, {useState, useContext} from 'react'
import logo from '../img/welcomecut.jfif'
import '../css/Signin.css'
import { json ,Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { LoginContext } from '../context/LoginContext';

export default function Signin() {
  const {setUserLogin}=useContext(LoginContext)
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const navigate = useNavigate()

  const notifyE=(msg)=>toast.error(msg);
  const notifyS=(msg)=>toast.success(msg);

  const loginData =()=> {
    fetch("/signin",{
      method:"post",
      headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        email:email,
        password:password
    })
}).then(res=>res.json())
.then(data=>{
    if(data.error){
        notifyE(data.error ) 
    }else{
        notifyS("Signin successfully!!")
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setUserLogin(true)
        navigate('/')
    }
    console.log(data)
    })
  }
  return (
    <div className='Signin'>
        <div className="loginform">
          <img className='signinlogo' src={logo} alt="" />
          <div>
            <input type="email" name="email" id="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder='enter your email'/>
          </div>
          <div>
            <input type="password" name="password" id="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder='enter your password'/>
          </div>
          <input type="submit" value='Signin' onClick={()=>{loginData()}} id='submit' />
          <p className="loginpara">Don't have an account? <Link to="/signup"><span className='span'>Sign Up</span></Link></p>
        </div>
    </div>
  )
}
