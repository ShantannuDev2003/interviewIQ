import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AuthForm from './pages/Auth'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from './redux/userSlice'
import InterviewPage from './pages/InterviewPage'
import InterviewHistory from './pages/InterviewHistory'
import InterviewReport from './pages/InterviewReport'
import Pricing from './pages/Pricing'

export const ServerUrl = "https://interviewiq-psi3.onrender.com"

const App = () => {
  const dispatch = useDispatch();
  const [showWebViewWarning, setShowWebViewWarning] = useState(false);

  // WebView detection
  useEffect(() => {
    const ua = navigator.userAgent;
    const isWebView =
      /FBAN|FBAV|Instagram|LinkedInApp|Twitter|Line|wv/.test(ua) ||
      (ua.includes('Android') && /Version\/\d/.test(ua));

    if (isWebView) {
      setShowWebViewWarning(true);
    }
  }, []);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(ServerUrl + "/api/user/current-user", { withCredentials: true })
        dispatch(setUserData(result.data.user))
        console.log(result.data)
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null))
      }
    }
    getUser();
  }, [dispatch])

  return (
    <>
      {/* WebView Warning Overlay */}
      {showWebViewWarning && (
        <div className='fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center px-6'>
          <div className='bg-white rounded-2xl p-8 text-center max-w-sm shadow-2xl'>
            <p className='text-4xl mb-4'>🌐</p>
            <h2 className='font-bold text-gray-800 text-lg mb-3'>
              Open in Chrome or Safari
            </h2>
            <p className='text-gray-500 text-sm mb-6 leading-relaxed'>
              Google Sign-In doesn't work inside LinkedIn or other apps.
              Please open this link in your browser.
            </p>
            <div className='bg-gray-100 rounded-xl p-4 text-left space-y-2 mb-6'>
              <p className='text-xs text-gray-600 font-semibold'>How to open:</p>
              <p className='text-xs text-gray-500'>
                Android → Tap <strong>⋮</strong> → "Open in Chrome"
              </p>
              <p className='text-xs text-gray-500'>
                iPhone → Tap <strong>⋯</strong> → "Open in Safari"
              </p>
            </div>
            <button
              onClick={() => setShowWebViewWarning(false)}
              className='text-xs text-gray-400 underline'>
              Continue anyway
            </button>
          </div>
        </div>
      )}

      {/* Existing Routes — unchanged */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={<AuthForm />} />
        <Route path='/interview' element={<InterviewPage />} />
        <Route path='/history' element={<InterviewHistory />} />
        <Route path='/report/:id' element={<InterviewReport />} />
        <Route path='/pricing' element={<Pricing />} />
      </Routes>
    </>
  )
}

export default App
