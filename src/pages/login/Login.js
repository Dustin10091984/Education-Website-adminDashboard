import Cookies from 'js-cookie'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaCircleNotch } from 'react-icons/fa6'

import logo from '../../assets/images/icons/icon-512x512.png'

const Login = () => {
  const navigate = useNavigate()
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState(Array(5).fill(''))
  const [otpRequested, setOtpRequested] = useState(false)
  const [isRequestingOtp, setIsRequestingOtp] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Redirect to landing if already logged in
  useEffect(() => {
    const authToken = Cookies.get('authToken')
    if (authToken) {
      navigate('/', { replace: true })
    } else {
      setIsCheckingAuth(false)
    }
  }, [navigate])

  if (isCheckingAuth) {
    return null
  }

  // This function will be called when the user requests an OTP
  const requestOtp = async (e) => {
    e.preventDefault()
    if (!mobile.startsWith('0') || mobile.length !== 11) {
      alert('شماره موبایل شما باید با 0 شروع و دارای 11 رقم باشد')
      return
    }
    setIsRequestingOtp(true)
    try {
      const response = await axios.post(
        'https://api.ebsalar.com/api/v1/login_register/',
        {
          phone_number: mobile,
        }
      )

      console.log('OTP requested successfully:', response.data)

      toast.success(`${response.data.results}`)
      setOtpRequested(true)
    } catch (error) {
      console.error(
        'Error requesting OTP:',
        error.response?.data || error.message
      )
      alert('Failed to send OTP. Please try again.')
    }
    setIsRequestingOtp(false)
  }

  // enabling long press of the delete button as well as delete by every digit starts here
  const clearOtp = () => {
    setOtp(Array(5).fill(''))
  }
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        setTimeout(() => document.getElementById(`otp-${index - 1}`).focus(), 0)
      } else {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    } else if (e.key === 'Backspace' && e.repeat) {
      e.preventDefault()
      setTimeout(clearOtp, 500)
    }
  }
  // enabling long press of the delete button as well as delete by every digit finishes here

  // normalized persian digits starts here
  const normalizeDigits = (str) => {
    const digitMap = {
      '۰': '0',
      '۱': '1',
      '۲': '2',
      '۳': '3',
      '۴': '4',
      '۵': '5',
      '۶': '6',
      '۷': '7',
      '۸': '8',
      '۹': '9',
      '٠': '0',
      '١': '1',
      '٢': '2',
      '٣': '3',
      '٤': '4',
      '٥': '5',
      '٦': '6',
      '٧': '7',
      '٨': '8',
      '٩': '9',
    }
    return str.replace(/[۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩]/g, (char) => digitMap[char])
  }
  // normalized persian digits finishes here

  // This function will be called when the user submits the OTP for verification
  const verifyOtp = async (e) => {
    e.preventDefault()
    const enteredOtp = otp.map(normalizeDigits).join('')
    console.log('Verifying OTP:', enteredOtp)

    try {
      const response = await axios.post(
        'https://api.ebsalar.com/api/v1/verify_login_register/',
        {
          phone_number: mobile,
          password: enteredOtp,
        }
      )

      console.log('OTP verification response:', response.data)

      if (response.status === 200) {
        Cookies.set('authToken', response.data.access, { expires: 20 })
        // OTP verification successful
        navigate('/')
      } else {
        // OTP verification failed
        alert('Incorrect OTP, please try again.')
      }
    } catch (error) {
      console.error(
        'Error verifying OTP:',
        error.response?.data || error.message
      )
      alert('Failed to verify OTP. Please try again.')
    }
  }

  const handleOtpChange = (element, index) => {
    const newOtp = [...otp]
    newOtp[index] = normalizeDigits(element.value)
    setOtp(newOtp)
    if (element.nextSibling && element.value) {
      element.nextSibling.focus()
    }
  }

  return (
    <div
      className='flex h-screen bg-[#221035e0] flex-col justify-center items-center' >
         <img
            src={logo}
            alt='ebs'
            width='200'
            height='200'
            className=' w-46 filter drop-shadow-lg shadow-black'
          />
          {/* <p className='text-gray-200 text-xl'>Welcome to EBS  </p> */}
          <div className='  fixed left-0   bottom-0  w-full     -z-10'>
 <svg width="100%" height="10%" id="svg" viewBox="0 0 1440 690" xmlns="http://www.w3.org/2000/svg" 
 className=""><defs><linearGradient id="gradient" x1="34%" y1="3%" x2="66%" y2="97%"><stop offset="5%" stopColor="#1e1357"></stop><stop offset="95%" stopColor="#eb144c"></stop></linearGradient></defs><path d="M 0,700 L 0,405 C 95.09230769230771,435.9730769230769 190.18461538461543,466.94615384615383 270,449 C 349.8153846153846,431.05384615384617 414.3538461538461,364.1884615384615 478,321 C 541.6461538461539,277.8115384615385 604.4000000000001,258.30000000000007 696,233 C 787.5999999999999,207.69999999999996 908.0461538461536,176.61153846153846 1000,146 C 1091.9538461538464,115.38846153846154 1155.4153846153847,85.25384615384615 1224,66 C 1292.5846153846153,46.746153846153845 1366.2923076923075,38.37307692307692 1440,30 L 1440,700 L 0,700 Z" stroke="none" strokeWidth="0" fill="url(#gradient)" fillOpacity="0"
 className="animate-flip-up animate-infinite animate-duration-[10000ms] animate-ease-in-out animate-alternate-reverse path-0"></path><defs><linearGradient id="gradient" x1="34%" y1="3%" x2="66%" y2="97%"><stop offset="5%" stopColor="#1e1357"></stop><stop offset="95%" stopColor="#eb144c"></stop></linearGradient></defs><path d="M 0,700 L 0,545 C 64.9,532.0192307692307 129.8,519.0384615384614 214,500 C 298.2,480.9615384615385 401.70000000000005,455.86538461538464 480,441 C 558.3,426.13461538461536 611.4000000000001,421.5 679,401 C 746.5999999999999,380.5 828.7,344.13461538461536 926,320 C 1023.3,295.86538461538464 1135.8,283.96153846153845 1224,261 C 1312.2,238.03846153846155 1376.1,204.01923076923077 1440,170 L 1440,700 L 0,700 Z" stroke="none" strokeWidth="0" fill="url(#gradient)" fillOpacity="0.4" 
 className="animate-flip-up animate-infinite animate-duration-[4000ms] animate-ease-in-out animate-alternate-reverse path-1"></path><defs><linearGradient id="gradient" x1="34%" y1="3%" x2="66%" y2="97%"><stop offset="5%" stopColor="#1e1357"></stop><stop offset="95%" stopColor="#eb144c"></stop></linearGradient></defs><path d="M 0,700 L 0,685 C 78.63076923076923,685.2089743589744 157.26153846153846,685.4179487179488 226,665 C 294.73846153846154,644.5820512820512 353.5846153846153,603.5371794871795 450,576 C 546.4153846153847,548.4628205128205 680.4,534.4333333333333 758,531 C 835.6,527.5666666666667 856.8153846153846,534.7294871794873 915,498 C 973.1846153846154,461.2705128205128 1068.3384615384616,380.64871794871794 1162,342 C 1255.6615384615384,303.35128205128206 1347.8307692307692,306.675641025641 1440,310 L 1440,700 L 0,700 Z" stroke="none" strokeWidth="0" fill="url(#gradient)" fillOpacity="0.53" 
 className="animate-flip-up animate-infinite animate-duration-[8000ms] animate-ease-in-out animate-alternate-reverse path-2"></path><defs><linearGradient id="gradient" x1="34%" y1="3%" x2="66%" y2="97%"><stop offset="5%" stopColor="#1e1357"></stop><stop offset="95%" stopColor="#eb144c"></stop></linearGradient></defs><path d="M 0,700 L 0,825 C 95.83076923076922,834.6551282051282 191.66153846153844,844.3102564102564 277,833 C 362.33846153846156,821.6897435897436 437.1846153846154,789.4141025641026 510,758 C 582.8153846153846,726.5858974358974 653.6,696.0333333333334 720,684 C 786.4,671.9666666666666 848.4153846153846,678.4525641025641 927,647 C 1005.5846153846154,615.5474358974359 1100.7384615384617,546.1564102564103 1189,507 C 1277.2615384615383,467.8435897435897 1358.6307692307691,458.9217948717949 1440,450 L 1440,700 L 0,700 Z" stroke="none" strokeWidth="0" fill="url(#gradient)" fillOpacity="1" 
 className=" path-3"></path></svg> 

 </div>
      <ToastContainer />
      <div className=' rounded-lg shadow-custom   p-8 w-full h-48 max-w-[360px]'>
        {!otpRequested ? (
          <form onSubmit={requestOtp} className='space-y-4'>
            <div>
              <label
                htmlFor='mobile'
                className='block text-sm text-center w-full py-2 font-medium text-gray-400'
              >
                شماره تلفن همراه
              </label>
              <input
                id='mobile'
                type='tel'
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                placeholder='09########## '
                pattern='^0\d{10}$'
                title='شماره تلفن با صفر شروع شده و ۱۱ رقمی باید باشد'
                className='mt-1 block w-full text-gray-50 bg-transparent border-b shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
            <button
              type='submit'
              style={{ backgroundColor: 'rgb(46, 170, 154)' }}
              // className=' w-full  p-2 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 flex justify-around items-center'
              // new class starts here
              className={`w-full p-2 rounded-xl text-white bg-gradient-to-r from-pink-900 via-purple-800 to-pink-700 flex justify-around items-center ${
                !isRequestingOtp && !otpRequested
                  ? 'active:bg-pink-600 active:scale-95 transition duration-150'
                  : 'opacity-50'
              }`}
              // new class finishes here
              disabled={isRequestingOtp || otpRequested} // Disable the button when requesting
            >
              {isRequestingOtp && (
                <FaCircleNotch className='text-white animate-spin' />
              )}
              ارسال
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className='space-y-4'>
            <div className='space-x-2'>
              <label
                htmlFor='mobile'
                className='block text-sm font-medium text-white mb-2 ml-2'
              >
                کد دریافتی را وارد کنید
              </label>
              {otp.map((value, index) => (
                <input
                  id={`otp-${index}`}
                  key={index}
                  type='text'
                  maxLength='1'
                  value={value}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className='w-12 h-12 animate-flip-up animate-once animate-ease-in text-center text-2xl bg-red border-2 border-gray-300 rounded outline-none transition duration-200'
                  pattern='\d*'
                  required
                />
              ))}
            </div>
            <button
              type='submit'
              style={{ backgroundColor: 'rgb(46, 170, 154)' }}
              className='w-full  text-white p-2 rounded  mt-4'
            >
              تایید
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login
