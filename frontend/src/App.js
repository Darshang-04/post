// import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './screens/Home';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Profile from './screens/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Createpost from './screens/Createpost';
import { LoginContext } from './context/LoginContext';
import React, {createContext, useState} from "react";
import Userprofile from './components/Userprofile';
import Myfollowing from './screens/Myfollowing';
import Connection from './components/Connection';

function App() {
  const [userLogin, setUserLogin] = useState("")

  return (
    <BrowserRouter>
    <div className="App">
      <LoginContext.Provider value={{setUserLogin}}>
      <ToastContainer theme="dark"/>
      <Navbar login={userLogin} />
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/signin' element={<Signin/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route exact path='/profile' element={<Profile/>}></Route>
        <Route path='/createpost' element={<Createpost/>}></Route>
        <Route path='/profile/:userid' element={<Userprofile/>}></Route>   
        <Route path='/followingpost' element={<Myfollowing/>}></Route>   
        <Route path='/connection' element={<Connection />}></Route>   
      </Routes>
      </LoginContext.Provider>
    </div>
    </BrowserRouter>
  );
}

export default App;
