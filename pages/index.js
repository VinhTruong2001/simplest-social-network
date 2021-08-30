import Head from 'next/head'
import { useStateValue } from '../components/common/StateProvider';
import { actionTypes } from '../components/common/reducer';

import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import LoginForm from '../components/LoginForm';
import Feed from '../components/Feed';
import UploadAvatar from '../components/UploadAvatar';
import { useEffect } from 'react';

export default function Home() {
  const [{ sidebarStatus, user, isChangeAvatar }, dispatch] = useStateValue();

  useEffect(() => {
    const userSession = window.sessionStorage;
    const userInfo = userSession.length !== 0 ? JSON.parse(userSession[Object.keys(userSession)]) : null

    dispatch({
      type: actionTypes.SET_USER,
      user: userInfo
    })
  }, [])

  const toggleSideBar = () => {
      dispatch({ 
          type: actionTypes.TOGGLE_SIDEBAR,
          sidebarStatus: false 
      })
  }
  
  return (
    <>
      { !user ?
        <div>
          <Head>
            <title>Đăng nhập vào Simplest</title>
            <link rel="icon" href="/favicon.png" />
          </Head>

          <LoginForm />
        </div>
        :
        (
        <div className="bg-[#1d3faa] lg:px-7 h-screen relative">
          <Head>
            <title>Simplest</title>
            <link rel="icon" href="/favicon.png" />
          </Head>
    
          
          <main className="relative flex h-full">
            {/* Sidebar */}
            <Sidebar />
    
            <div className="lg:py-4 h-full flex-1">
              <div className="bg-gray-100 h-full lg:rounded-tl-[30px] lg:rounded-bl-[30px] pb-4 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent lg:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full">
                {/* Header */}
                <Header />
    
                <div className="lg:grid lg:grid-cols-2 lg:pl-[180px] lg:pr-6">
                  {/* Feed */}
                  <Feed />

                  {/* Widgets */}
                  <div></div>
                </div>
              </div>
            </div>
          </main>
          
          
          <div className={`flex items-center justify-center absolute top-0 h-screen left-0 right-0 ${!sidebarStatus && !isChangeAvatar && 'hidden'}`}>
            <div onClick={ toggleSideBar } className={`overlay fixed top-0 bottom-0 left-0 right-0 bg-black opacity-40 ${isChangeAvatar ? 'z-[60]' : 'z-40'}`}></div>
            
            { isChangeAvatar && 
              <UploadAvatar />
            }
          </div>
        </div>
        )
    }
    </>
  )
}
