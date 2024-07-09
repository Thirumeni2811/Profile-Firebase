import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore'; 
import { toast } from 'react-toastify';
import ProfilePic from '../ProfilePic.png'
import Loading from '../Loading.svg'
const Signup = () => {
  const [Firstname, setFirstname] = useState("");
  const [Lastname, setLastname] = useState("");
  const [DateofBirth, setDateofBirth] = useState("");
  const [CountryCode, setCountryCode] = useState("+91")
  const [Phoneno, setPhoneNo] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentDate = new Date().toISOString().split('T')[0];

  // Function to generate random password
  const generatePassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let generatedPassword = '';
    const passwordLength = Math.floor(Math.random() * (16 - 8 + 1)) + 8; 
    for (let i = 0; i < passwordLength; i++) {
      generatedPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const isValidPasswordGenerate = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/.test(generatedPassword);
    if (isValidPasswordGenerate) {
      toast(
        `Generated Password: ${generatedPassword}` , {
          duration: 6000,
          position:"top-center"
        })
    } else {
      generatePassword();
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (Password !== ConfirmPassword) {
      toast.error("Passwords do not match", {
        position: "bottom-center"
      });
      return;
    }
  
    //Check valid mobile number
    let isValidPhone = false;
    switch (CountryCode) {
      case "+1": // USA
        isValidPhone = /^\(\d{3}\) \d{3}-\d{4}$/.test(Phoneno);
        break;
      case "+44": // UK
        isValidPhone = /^(?:\d{5}|\d{4} \d{6}|\d{5} \d{5}|\d{4} \d{4} \d{2})$/.test(Phoneno);
        break;
      case "+91": // India
        isValidPhone = /^[6-9]\d{9}$/.test(Phoneno);
        break;
      case "+81": // Japan
        isValidPhone = /^\d{3}-\d{4}-\d{4}$/.test(Phoneno);
        break;
      case "+61": // Australia
        isValidPhone = /^(\(0[2-9]\)|0[2-9])\d{8}$/.test(Phoneno);
        break;
      default:
        break;
    }
  
    if (!isValidPhone) {
      toast.error("Please enter a valid phone number for the selected country", {
        position: "bottom-center"
      });
      return;
    }
  
    //Check valid password 
    const isValidPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/.test(Password)
    if (!isValidPassword) {
      toast.error("The password must contain at least one digit (1-9), one uppercase letter, one lowercase letter, one special character, and be 8-16 characters long.", {
        position: "bottom-center"
      });
      return;
    }
  
    //Check valid email address
    const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(Email)
    if (!isEmail) {
      toast.error("Invalid Email address ", {
        position: "bottom-center"
      })
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
          CountryCode: CountryCode,
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
      if (error.code === "auth/email-already-in-use") {
        console.log(error.message)
        toast.error("The email address is already in use by another account.", {
          position: "bottom-center"
        });
      } else {
        toast.error("Failed to Sign Up: " + error.message, {
          position: "bottom-center"
        });
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      {navigate ? (
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
                  placeholder='Enter your Email address'
                  required
                />
              </Form.Group>
              <div className='d-flex align-items-center justify-content-center gap-2'>
                <Form.Group id="Firstname">
                  <Form.Label>Firstname</Form.Label>
                  <Form.Control
                    type="text"
                    value={Firstname}
                    placeholder='Enter your Firstname'
                    style={{ textTransform: 'capitalize' }}
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group id="Lastname">
                  <Form.Label>Lastname</Form.Label>
                  <Form.Control
                    type="text"
                    value={Lastname}
                    placeholder='Enter your Lastname'
                    style={{ textTransform: 'capitalize' }}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
              <Form.Group id="DateofBirth">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  value={DateofBirth}
                  onChange={(e) => setDateofBirth(e.target.value)}
                  max={currentDate}
                  required
                />
              </Form.Group>
              <Form.Group id="Phoneno">
                <Form.Label>Phone number</Form.Label>
                <div className='d-flex gap-2'>
                  <Form.Control
                    style={{ width: "130px", cursor: "pointer" }}
                    as="select"
                    value={CountryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    required
                  >
                    <option value="+1">+1 (USA)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+91">+91 (India)</option>
                    <option value="+81">+81 (Japan)</option>
                    <option value="+61">+61 (Australia)</option>
                  </Form.Control>
                  <Form.Control
                    type="text"
                    value={Phoneno}
                    onChange={(e) => setPhoneNo(e.target.value)}
                    required
                    placeholder="Phone number"
                  />
                </div>
              </Form.Group>
              <div className='d-flex align-items-center justify-content-center gap-2'>
                <Form.Group id="Password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={Password}
                    placeholder='Set Password'
                    onChange={(e) => setPassword(e.target.value)}
                    onClick={generatePassword}
                    required
                  />
                </Form.Group>
                <Form.Group id="ConfirmPassword">
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control
                    type="password"
                    value={ConfirmPassword}
                    placeholder='Confirm your Password'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
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

export default Signup;
