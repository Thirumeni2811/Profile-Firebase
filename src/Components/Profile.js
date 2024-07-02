import React, { useEffect } from 'react'
import { Card , Button  } from 'react-bootstrap'
import { useState } from 'react'
import { useNavigate , Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getDoc  , doc, deleteDoc} from 'firebase/firestore'
import { auth , db } from '../firebase'
import { signOut } from 'firebase/auth'
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const Profile = () => {
    const [currentUser , setCurrentUser] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    const handleLogout = async (e) => {
        e.preventDefault();
        
        try{
            setLoading(true)
            await signOut(auth)
            console.log("Logout Successfully")
            toast.success("Logout Successfully !!" , {
                position:"top-center"
        }) 
        navigate('/login');
        }catch(error){
            toast.error("Failed to Login" , {
                position:"bottom-center"
            })   
            console.log(error.message)
        }finally{
            setLoading(false)
        }
    };
    

    useEffect(() => {
    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                console.log(user);
                const docRef = doc(db, "User", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setCurrentUser(docSnap.data());
                    console.log(docSnap.data());
                } 
            } else {
                console.log("No user logged in");
                navigate('/login');
            }
        });
    };

    fetchUserData();
}, [navigate]); 

const reauthenticate = async (currentPassword) => {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    try {
      await reauthenticateWithCredential(user, credential);
    } catch (error) {
      throw new Error("Reauthentication failed. Please check your current password.");
    }
  };

  const deleteAccount = async () => {
    try {
      const currentPassword = prompt("Please enter your current password for confirmation:");
      if (!currentPassword) {
        toast.error("Password is required for re-authentication.", {
          position: "bottom-center"
        });
        return;
      }

      setLoading(true);
      const user = auth.currentUser;

      await reauthenticate(currentPassword);

      if (user) {
        await deleteDoc(doc(db, "User", user.uid));
        await user.delete();
        
        toast.success("Account successfully deleted", {
          position: "top-center"
        },navigate("/login")
    );
      }
    } catch (error) {
      toast.error("Failed to delete account: " + error.message, {
        position: "bottom-center"
      });
    } finally {
      setLoading(false);
    }
  };

  
    return (
      <div>
        {currentUser ? (
            <>
            <Card>
                <Card.Body>
                    <div className='text-center'>
                        <img 
                            src={currentUser.Photo}
                            className='rounded-circle w-40'
                            alt=''
                        />
                    </div>
                    <h1 className="text-center mb-2">Hi ,{currentUser.displayName }</h1>
                    <p className="text-center mb-2">{currentUser.Email}</p>
                    <Link to="/view-profile" className="btn btn-primary w-100 mt-3">View Profile</Link>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-3">
                <Button onClick={handleLogout} disabled={loading}>Log Out</Button>
            </div>
            <div className="w-100 text-center mt-3">
                <Button onClick={deleteAccount} disabled={loading} className='bg-danger border-danger'>Delete Account</Button>
            </div>
        </>
        ) : (
            <Card>
                <Card.Body>
                    <h2 className='text-center'>Loading... </h2>
                </Card.Body>
            </Card>
        )}
        
       
     
      </div>
    );
  }
  
  export default Profile;
  