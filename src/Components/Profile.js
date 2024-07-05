import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDoc, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { signOut, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import Loading from '../Loading.svg';

const Profile = () => {
    const [currentUser, setCurrentUser] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            await signOut(auth);
            console.log("Logout Successfully");
            toast.success("Logout Successfully !!", {
                position: "top-center"
            });
            navigate('/login');
        } catch (error) {
            toast.error("Failed to Login", {
                position: "bottom-center"
            });
            console.log(error.message);
        } finally {
            setLoading(false);
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
                }, navigate("/login"));
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
                        <Card.Body style={{ backgroundColor: 'transparent' }}>
                            <div className='text-center'>
                                <img 
                                    src={currentUser.Photo}
                                    alt=''
                                    style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                                />
                            </div>
                            <h1 className="text-center mb-2"                   
                              style={{ textTransform: 'capitalize' }}
                            >
                              Hi, {currentUser.displayName}
                            </h1>
                            <p className="text-center mb-2">{currentUser.Email}</p>
                            <Link to="/view-profile" className="btn btn-primary w-100 mt-3">View Profile</Link>
                        </Card.Body>
                    </Card>
                    {loading ? (
                      <Card style={{ backgroundColor: 'transparent', border: 'none' }}>
                        <Card.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                          <img 
                            src={Loading} 
                            alt='Loading...'
                            style={{
                              width: '100px',
                            }}
                          />
                        </Card.Body>
                      </Card>
                      ) : (
                        <div className="w-100 text-center mt-3">
                          <Button onClick={handleLogout} disabled={loading}>Log Out</Button>
                        </div>
                      )}
                      {loading ? (
                      <Card style={{ backgroundColor: 'transparent', border: 'none' }}>
                        <Card.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                          <img 
                            src={Loading} 
                            alt='Loading...'
                            style={{
                              width: '100px',
                            }}
                          />
                        </Card.Body>
                      </Card>
                      ) : (
                        <div className="w-100 text-center mt-3">
                            <Button onClick={deleteAccount} disabled={loading} className='bg-danger border-danger'>Delete Account</Button>
                        </div>
                      )}
                    
                </>
            ) : (
                <Card style={{ backgroundColor: 'transparent' , border:'none' }}>
                    <Card.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
                        <img 
                            src={Loading} 
                            alt='Loading...'
                            style={{
                                width: '100px',
                            }}
                        />
                    </Card.Body>
                </Card>
            )}
        </div>
    );
}

export default Profile;
