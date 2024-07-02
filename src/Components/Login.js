import { signInWithEmailAndPassword } from 'firebase/auth';
import React, {  useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Link , useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth } from '../firebase';
import SignInwithGoogle from './SignInwithGoogle';
const Login = () => {
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

    const handleSubmit = async (e) => {
      e.preventDefault()

      try {
        setLoading(true);
        await signInWithEmailAndPassword(auth,Email,Password)
        navigate("/")
        console.log("Login Successfully")
        toast.success("Login Successfully !!" , {
          position:"top-center"
        }) 
      } catch(error) {
        toast.error("Failed to Login" , {
          position:"bottom-center"
        })   
        console.log(error.message)
      }finally{
        setLoading(false);
      }

    }

  return (
    <>
      <Card>
        <Card.Body>
          <h1 className="text-center mb-4 ">Log In</h1>
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
                <Form.Group id="Password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                  />            
                </Form.Group>
                <Button disabled={loading} className="w-100 mt-4" type="submit">
                Log In
                </Button>
            </Form>
            <div className="w-100 text-center mt-3">
                <Link to="/forgot-password" className='text-decoration-none'>Forgot Password ?</Link>
            </div>
            <SignInwithGoogle />
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Don't have an account? <Link to="/signup" className='text-decoration-none'>Sign Up</Link>
      </div>
    </>
  );
};

export default Login;
