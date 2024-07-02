import React from 'react';
import google from '../Google.png';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const SignInwithGoogle = () => {
  const navigate = useNavigate('');

  const getDisplayName = (firstname, lastname) => {
    const firstNamePart = firstname ? firstname.trim() : '';
    const lastNamePart = lastname ? lastname.trim() : '';

    return `${firstNamePart} ${lastNamePart}`.trim();
  };

  function googleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        console.log(result);
        const user = result.user;
        if (result.user) {
          const displayName = getDisplayName(user.displayName.split(' ')[0], user.displayName.split(' ')[1]);

          await setDoc(doc(db, "User", user.uid), {
            Email: user.email,
            Firstname: user.displayName.split(' ')[0], 
            Lastname: user.displayName.split(' ')[1],
            displayName: displayName,
            Photo: user.photoURL
          });
          toast.success("Login Successfully !!", {
            position: "top-center"
          });
          navigate('/');
        }
      })
      .catch((error) => {
        toast.error("Login Failed: " + error.message, {
          position: "bottom-center"
        });
        console.error("Error during Google login:", error);
      });
  }

  return (
    <>
      <p
        className="fs-6 fw-semibold mt-3 text-center"
        style={{ color: '#b2b2b2' }}
      >
        -- Or continue with --
      </p>
      <div
        className="text-center"
        style={{ cursor: 'pointer' }}
        onClick={googleLogin}
      >
        <img
          src={google}
          alt='Google'
          width="60%"
        />
      </div>
    </>
  );
}

export default SignInwithGoogle;
