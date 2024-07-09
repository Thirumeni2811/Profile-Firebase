import { RecaptchaVerifier, signInWithEmailAndPassword, signInWithPhoneNumber } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Tabs, Tab } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth } from '../firebase';
import SignInwithGoogle from './SignInwithGoogle';
import Loading from '../Loading.svg';
import ReCAPTCHA from "react-google-recaptcha";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // New state to track OTP sent status
  const [user, setUser] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      auth.settings.appVerificationDisabledForTesting = true;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
      toast.success("Login Successfully !!", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Firebase Error:", error);
      toast.error("Failed to Login. Please check your credentials.", {
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  };

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          onSignup();
        },
        'expired-callback': () => {
          // Handle expired reCAPTCHA
        },
      });
    }
  }

  const onSignup = () => {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;
    const formatPhone = `+${phoneNo}`;

    signInWithPhoneNumber(auth, formatPhone, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        console.log('OTP sent successfully, confirmationResult:', confirmationResult);
        setLoading(false);
        setOtpSent(true); // Set OTP sent status to true
        toast.success("OTP sent successfully", {
          position: "top-center",
        });
      }).catch((error) => {
        console.error("Error sending OTP:", error.message);
        if (error.code === 'auth/too-many-requests') {
          toast.error("Too many requests. Please try again later.", {
            position: "bottom-center",
          });
        } else {
          toast.error("Failed to send OTP. Please check the phone number format and try again.", {
            position: "bottom-center",
          });
        }
        setLoading(false);
      });
  };

  function onOTPVerify() {
    setLoading(true)
    window.confirmationResult.confirm(otp).then(async (res) => {
      console.log(res)
      setUser(res.user)
      setLoading(false)
      navigate("/view-profile"); 
    }).catch(err => {
      console.log(err)
      setLoading(false)
      toast.error("Failed to verify OTP. Please check the OTP and try again.", {
        position: "bottom-center",
      });
    })
  }

  const ok = (e) => {
    console.log(e);
  }

  return (
    <div>
      {navigate ? (
        <>
          <Tabs defaultActiveKey="phone" id="justify-tab-example" className="mb-3" justify>
            <Tab eventKey="google" title="Google">
              <Card>
                <Card.Body>
                  <h1 className="text-center mb-4">Log In</h1>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group id="Email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group id="Password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Button disabled={loading} className="w-100 mt-4" type="submit">
                      Log In
                    </Button>
                  </Form>
                  <div className="w-100 text-center mt-3">
                    <Link to="/forgot-password" className='text-decoration-none'>Forgot Password?</Link>
                  </div>
                  <SignInwithGoogle />
                </Card.Body>
              </Card>
            </Tab>
            <Tab eventKey="phone" title="Phone Number">
              <Card>
                <Card.Body>
                  <h1 className="text-center mb-4">Log In</h1>
                  <Form onSubmit={e => e.preventDefault()}>
                    <div id='recaptcha-container'></div>
                    <>
                      <Form.Group id="Phoneno">
                        <PhoneInput
                          country={'in'}
                          value={phoneNo}
                          onChange={setPhoneNo}
                        />
                      </Form.Group><br/>
                      <ReCAPTCHA
                        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                        onChange={ok}
                      />
                      <Button disabled={loading} className="w-100 mt-4" onClick={onSignup}>
                        Send OTP
                      </Button>
                    </>
                    {otpSent && ( // Show OTP input only after OTP is sent
                      <>
                        <Form.Group id="otp">
                          <Form.Label>One Time Password (OTP)</Form.Label>
                          <Form.Control
                            style={{ width: '15rem', marginLeft: '4.5rem' }}
                            type="text"
                            autoComplete="one-time-code"
                            inputMode="numeric"
                            maxLength="6"
                            pattern="\d{6}"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                          />
                        </Form.Group>
                        <Button disabled={loading} className="w-100 mt-4 btn-success" onClick={onOTPVerify}>
                          Verify OTP
                        </Button>
                      </>
                    )}
                  </Form>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
          <div className="w-100 text-center mt-2">
            Don't have an account? <Link to="/signup" className='text-decoration-none'>Sign Up</Link>
          </div>
        </>
         ) : (
        <Card style={{ backgroundColor: 'transparent', border: 'none' }}>
        <Card.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
          <img src={Loading} alt='Loading...' style={{ width: '100px' }} />
        </Card.Body>
      </Card>
      )}
    </div>
  );
};

export default Login;
