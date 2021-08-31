import { useEffect } from 'react';
import Head from 'next/head';
import { useStateValue } from '../components/common/StateProvider';
import { actionTypes } from '../components/common/reducer';

import Sidebar from '../components/sidebar/Sidebar'
import Header from '../components/header/Header'
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import UploadAvatar from './UploadAvatar';

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation"

// import Swiper core and required modules
import SwiperCore, { Navigation } from 'swiper';

// install Swiper modules
SwiperCore.use([Navigation]);


function Layout({ children }) {
    const [{ sidebarStatus, isChangeAvatar, user }, dispatch] = useStateValue();

    useEffect(() => {
        if (!user) {
          const idbOpenRequest = window.indexedDB.open("firebaseLocalStorageDb");

          // Request error
          idbOpenRequest.onerror = function(event) {
          console.log("Database error: " + event.target.errorCode);
          };

          // Request success
          idbOpenRequest.onsuccess = function(event) {
            const db = idbOpenRequest.result;
            const transaction = db.transaction(["firebaseLocalStorage"], "readonly");

            // Transaction error
            transaction.onerror = function(event) {
                console.log("Transaction error: " + transaction.error);
            };

            const objectStore = transaction.objectStore("firebaseLocalStorage");
            const objectStoreGetKeyRequest = objectStore.getAllKeys()
            
            objectStoreGetKeyRequest.onsuccess = function(event) {
                if (objectStoreGetKeyRequest.result.length !== 0) {
                  const objectStoreGetDataRequest = objectStore.get(objectStoreGetKeyRequest.result[0]);
                  
                  objectStoreGetDataRequest.onsuccess = function(event) {
                      const user = objectStoreGetDataRequest.result.value;

                      dispatch({
                      type: actionTypes.SET_USER,
                      user,
                      })
                  }
                }
            };
          }; 
        }
    }, [])
    
    const toggleSideBar = () => {
        dispatch({ 
            type: actionTypes.TOGGLE_SIDEBAR,
            sidebarStatus: false 
        })
    }

    const toggleUploadAvatar = () => {
      dispatch({
          type: actionTypes.TOGGLE_CHANGE_AVATAR,
          isChangeAvatar: false,
      })
    }

    const closeAll = () => {
        sidebarStatus && toggleSideBar();
        isChangeAvatar && toggleUploadAvatar();
        isChangeCoverImg && toggleChangeCoverImg();
    }

    return (
        <>
          { !user ?
              <div>
                <Head>
                    <title>Đăng nhập vào Simplest</title>
                    <link rel="icon" href="/favicon.png" />
                </Head>

                <Swiper 
                    navigation={true}
                    spaceBetween={10}
                    className="auth"
                >
                    <SwiperSlide>
                      <LoginForm />
                    </SwiperSlide>
                    <SwiperSlide>
                      <RegisterForm />
                    </SwiperSlide>  
                </Swiper>
              </div>
            : (
              <div className="bg-[#1d3faa] xl:px-7 h-screen relative">
                <div className="relative flex h-full">
                  {/* Sidebar */}
                  <Sidebar />
      
                  <div className="xl:py-4 h-full flex-1">
                    <div className="content-container relative bg-gray-100 h-full xl:rounded-tl-[30px] xl:rounded-bl-[30px] pb-4 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent xl:scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full">
                      {/* Header */}
                      <Header />

                      <main>{ children }</main>

                      <div className={`flex items-center justify-center absolute top-0 h-screen left-0 right-0 ${!sidebarStatus && !isChangeAvatar && 'hidden'}`}>
                        <div onClick={ closeAll } className={`overlay fixed top-0 bottom-0 left-0 right-0 bg-black opacity-40 ${isChangeAvatar ? 'z-[60]' : 'z-40'}`}></div>
                        
                        { isChangeAvatar && 
                          <UploadAvatar />
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </>
    )
}

export default Layout
