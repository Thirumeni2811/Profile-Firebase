import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore'; 
import { toast } from 'react-toastify';
import ProfilePic from '../ProfilePic.png'
const Signup = () => {
  const [Firstname, setFirstname] = useState("");
  const [Lastname, setLastname] = useState("");
  const [DateofBirth, setDateofBirth] = useState("");
  const [Phoneno, setPhoneNo] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Password !== ConfirmPassword) {
      toast.error("Passwords do not match", {
        position: "bottom-center"
      });
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, Email, Password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "User", user.uid), {
          Email: user.email,
          Firstname: Firstname,
          Lastname: Lastname,
          DateofBirth: DateofBirth,
          Phoneno: Phoneno,
          displayName: `${Firstname} ${Lastname}`,
          Photo: user.photoURL || ProfilePic
        });
        toast.success("Successfully Registered!!", {
          position: "top-center"
        });
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to Sign Up: " + error.message, {
        position: "bottom-center"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h1 className="text-center mb-4">Sign Up</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group id="Profile">
              <div className="mt-2 mb-2 text-center">
                <img
                  src={ProfilePic}
                  value={ProfilePic}
                  alt="Profile Preview"
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
              </div>
            </Form.Group>
            <Form.Group id="Email">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                value={Email}
                onChange={(e) => setEmail(e.target.value)} 
                required
              />          
            </Form.Group>
            <Form.Group id="Firstname">
              <Form.Label>Firstname</Form.Label>
              <Form.Control 
                type="text" 
                value={Firstname}
                onChange={(e) => setFirstname(e.target.value)} 
                required
              />
            </Form.Group>
            <Form.Group id="Lastname">
              <Form.Label>Lastname</Form.Label>
              <Form.Control 
                type="text" 
                value={Lastname}
                onChange={(e) => setLastname(e.target.value)} 
                required
              />            
            </Form.Group>
            <Form.Group id="DateofBirth">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control 
                type="date" 
                value={DateofBirth}
                onChange={(e) => setDateofBirth(e.target.value)} 
                required
              />           
            </Form.Group>
            <Form.Group id="Phoneno">
              <Form.Label>Phone number</Form.Label>
              <Form.Control 
                type="text" 
                value={Phoneno}
                onChange={(e) => setPhoneNo(e.target.value)} 
                required
              />           
            </Form.Group>
            <Form.Group id="Password">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                value={Password}
                onChange={(e) => setPassword(e.target.value)} 
                required
              />            
            </Form.Group>
            <Form.Group id="ConfirmPassword">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control 
                type="password" 
                value={ConfirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required
              />            
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-4" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login" className='text-decoration-none'>Log In</Link>
      </div>
    </>
  );
};

export default Signup;
