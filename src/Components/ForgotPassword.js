import { sendPasswordResetEmail } from 'firebase/auth';
import React, {useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Link , useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth } from '../firebase';
const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [Email, setEmail] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try{
      setLoading(true)
      await sendPasswordResetEmail(auth , Email)
      navigate("/")
      console.log("Reset the password successfully")
      toast(
        "Check your Inbox for further ...",
        {
          duration: 6000,
          position:"top-center"
        }
      ); 
    }catch(error){
      console.log(error.message)
    }finally{
      setLoading(true)
    }

  }
  

  return (
    <>
      <Card>
        <Card.Body>
          <h1 className="text-center mb-4 ">Password Reset</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group id="Email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                  />            
                </Form.Group>

                <Button disabled={loading} className="w-100 mt-4" type="submit">
                Reset Password
                </Button>
            </Form>
            <div className="w-100 text-center mt-3">
                <Link to="/login" className='text-decoration-none'>Login</Link>
            </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Don't have an account? <Link to="/signup" className='text-decoration-none'>Sign Up</Link>
      </div>
    </>
  );
};

export default ForgotPassword;
