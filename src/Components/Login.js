import { signInWithEmailAndPassword } from 'firebase/auth';
import React, {  useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Link , useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth } from '../firebase';
import SignInwithGoogle from './SignInwithGoogle';
import Loading from '../Loading.svg'

const Login = () => {
  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, Email, Password);
      navigate("/");
      console.log("Login Successfully");
      toast.success("Login Successfully !!", {
        position: "top-center"
      });
    } catch(error) {
      let errorMessage = "Failed to Login. Please check your credentials.";
      console.error("Firebase Error:", error);
      toast.error(errorMessage, {
        position: "bottom-center"
      });
    } finally {
      setLoading(false);
    }
  }
  
  
  

  return (
    <div>
      {navigate ? (
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
};

export default Login;
