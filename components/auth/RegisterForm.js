import Image from 'next/image';
import { useRef } from 'react';
import { auth, db } from '../../firebase'
import { useStateValue } from '../common/StateProvider';
import { actionTypes } from '../common/reducer';

// Icon
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

function RegisterForm() {
    const [{ user }, dispatch] = useStateValue();
    const firstNameRef = useRef("");
    const lastNameRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const confirmPassWordRef = useRef("");

    const register = (e) => {
        e.preventDefault();

        auth.createUserWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;

                user.updateProfile({
                    displayName: lastNameRef.current.value + ' ' + firstNameRef.current.value,
                }).then(function() {
                    db.collection('users').doc(`${ user.uid }`).set({
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                        posts: [],
                        friendRequestsSent: [],
                        friendRequestsPending: [],
                        friends: [],
                    })
                    
                    dispatch({ 
                        type: actionTypes.SET_USER,
                        user,
                    })

                    dispatch({
                        type: actionTypes.TOGGLE_CHANGE_AVATAR,
                        isChangeAvatar: userCredential.additionalUserInfo.isNewUser,
                    })
                }, function(error) {
                    console.log(error.message)
                });        
            })
            .catch((error) => {
                console.log(error.message)
            });
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
                    <p className="text-gray-300">Chia s??? t???ng kho???nh kh???c vui v??? trong cu???c s???ng <br></br> v???i b???n c???a b???n.</p>
                </div>

                {/* Register form */}
                <div className="flex-1 py-12 px-7">
                    <h1 className="font-semibold text-2xl text-gray-600 mb-14 text-center">T???o t??i kho???n m???i</h1>
                    <form onSubmit={ register } className="flex flex-col space-y-5" >
                       <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-5 sm:space-y-0">
                            <div className="flex-1">
                                <label className="text-xl text-semibold">H???</label>
                                <div className="border border-gray-200 rounded-lg p-2 mt-1 flex items-center">
                                    <PermIdentityIcon className="text-gray-400"/>
                                    <input 
                                        ref={ lastNameRef } 
                                        type="text" 
                                        name="lastName" 
                                        className="flex-1 outline-none ml-2" 
                                        placeholder="H??? t??n"

                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="text-xl text-semibold">T??n</label>
                                <div className="border border-gray-200 rounded-lg p-2 mt-1 flex items-center">
                                    <PermIdentityIcon className="text-gray-400"/>
                                    <input 
                                        ref={ firstNameRef } 
                                        type="text" 
                                        name="firstName" 
                                        className="flex-1 outline-none ml-2" 
                                        placeholder="T??n"

                                    />
                                </div>
                            </div>
                       </div>
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
                        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-5 sm:space-y-0">
                            <div className="flex-1">
                                <label className="text-xl text-semibold">M???t kh???u</label>
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
                            <div className="flex-1">
                                <label className="text-xl text-semibold">X??c nh???n m???t kh???u</label>
                                <div className="border border-gray-200 rounded-lg p-2 mt-1 flex items-center">
                                    <LockOutlinedIcon className="text-gray-400"/>
                                    <input 
                                        ref={ confirmPassWordRef } 
                                        type="password" 
                                        name="confirmPassword" 
                                        className="flex-1 outline-none ml-2" 
                                        placeholder="*******"

                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-gray-400">????? ????ng nh???p</span> <br/>
                                <span className="text-blue-400">vu???t qua ho???c nh???n m??i t??n b??n tr??i </span>
                            </div>
                            <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md">????ng k??</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterForm
