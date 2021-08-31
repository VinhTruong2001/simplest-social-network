import Image from 'next/image';
import { useRef } from 'react';
import { auth, db } from '../../firebase'
import firebase from 'firebase'
import { useStateValue } from '../common/StateProvider';
import { actionTypes } from '../common/reducer';

// Icon
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

function LoginForm() {
    const [{ user }, dispatch] = useStateValue();
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const keepLogInRef = useRef("");

    const firebaseEmailLogin = () => ( auth.signInWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;

                dispatch({ 
                    type: actionTypes.SET_USER,
                    isChangeAvatar: userCredential.additionalUserInfo.isNewUser,
                    user,
                })
            })
            .catch((error) => {
                console.log(error.message)
            })
    )
    
    const login = (e) => {
        e.preventDefault();

        if (keepLogInRef.current.checked) {
            auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(() => {
                    return firebaseEmailLogin();
                })
                .catch((error) => {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                }
            );
        } else {
            auth.setPersistence(firebase.auth.Auth.Persistence.NONE)
                .then(() => {
                    return firebaseEmailLogin();
                })
                .catch((error) => {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                }
            );
        }

        
    }
    
    return (
        <div className="flex sm:items-center justify-center min-h-screen">
            <div className="flex flex-col sm:flex-row lg:w-[1180px]">
                {/* Logo */}
                <div className="flex-1 flex flex-col p-[14px] justify-center bg-[#2b54d2] sm:rounded-2xl text-center h-190px w-full sm:w-1/2 md:h-[516px]">
                    <div>
                        <Image 
                            src="/images/logo-light-icon.png" 
                            width={80}
                            height={80}
                        />
                    </div>
                    <h2 className="text-white lg:text-xl font-semibold my-6">Simplest</h2>
                    <p className="text-gray-300">Chia sẻ từng khoảnh khắc vui vẻ trong cuộc sống <br></br> với bạn của bạn.</p>
                </div>

                {/* Register form */}
                <div className="flex-1 py-12 px-7">
                    <h1 className="font-semibold text-2xl text-gray-600 mb-14 text-center">Đăng nhập</h1>
                    <form onSubmit={ login } className="flex flex-col space-y-5" >
                        <div>
                            <label className="text-xl text-semibold">Email</label>
                            <div className="border border-gray-200 rounded-lg p-2 mt-1 flex items-center">
                                <MailOutlineIcon className="text-gray-400"/>
                                <input 
                                    ref={ emailRef } 
                                    type="text" 
                                    name="email" 
                                    className="flex-1 outline-none ml-2" 
                                    placeholder="name@example.com"     
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xl text-semibold">Mật khẩu</label>
                            <div className="border border-gray-200 rounded-lg p-2 mt-1 flex items-center">
                                <LockOutlinedIcon className="text-gray-400"/>
                                <input
                                    ref={ passwordRef } 
                                    type="password" 
                                    name="password" 
                                    className="flex-1 outline-none ml-2" 
                                    placeholder="******"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            <input type="checkbox" ref={ keepLogInRef } name="keepLogIn" id="keep-log-in"/>
                            <label htmlFor="keep-log-in">Duy trì đăng nhập</label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-gray-400">Nếu chưa có tài khoản hãy </span> <br/>
                                <span className="text-blue-400">vuốt qua hoặc nhấn mũi tên bên phải </span>
                            </div>
                            <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md">Đăng nhập</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginForm
