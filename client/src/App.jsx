import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import AuthForm from './pages/Auth'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice'
import InterviewPage from './pages/InterviewPage'
import InterviewHistory from './pages/InterviewHistory'
import InterviewReport from './pages/InterviewReport'
import Pricing from './pages/Pricing'

export const ServerUrl="https://interviewiq-psi3.onrender.com"
const App = () => {

  const dispatch=useDispatch();


  useEffect(()=>{
    const getUser=async()=>{
      try {
        const result=await axios.get(ServerUrl+"/api/user/current-user",{withCredentials:true})
        dispatch(setUserData(result.data.user))
        console.log(result.data)
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null))
      }
    }
    getUser();
  },[dispatch])
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth' element={<AuthForm />} />
      <Route path='/interview' element={<InterviewPage />} />
      <Route path='/history' element={<InterviewHistory />} />
      <Route path='/report/:id' element={<InterviewReport />} />
            <Route path='/pricing' element={<Pricing />} />
      

    </Routes>
  )
}

export default App
