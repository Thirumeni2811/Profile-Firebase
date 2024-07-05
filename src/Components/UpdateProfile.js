import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Card, Button } from 'react-bootstrap';
import { setDoc, doc, getDoc } from 'firebase/firestore'; 
import { db, auth, storage } from '../firebase';
import { toast } from 'react-toastify';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import Loading from '../Loading.svg';

const UpdateProfile = () => {
  const [Firstname, setFirstname] = useState("");
  const [Lastname, setLastname] = useState("");
  const [DateofBirth, setDateofBirth] = useState("");
  const [CountryCode, setCountryCode] = useState("")
  const [Phoneno, setPhoneNo] = useState("");
  const [Email, setEmail] = useState("");
  const [Photo, setPhoto] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email);
      setCurrentUser({
        Email: user.email,
        Firstname: user.displayName ? user.displayName.split(' ')[0] : '',
        Lastname: user.displayName ? user.displayName.split(' ')[1] : '',
        DateofBirth: '',
        Phoneno: '',
        Photo: user.photoURL || ''
      });

      const fetchUserData = async () => {
        const docRef = doc(db, 'User', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const { Firstname, Lastname, DateofBirth, CountryCode, Phoneno, Photo } = docSnap.data();
          setFirstname(Firstname || '');
          setLastname(Lastname || '');
          setDateofBirth(DateofBirth || '');
          setCountryCode(CountryCode || '');
          setPhoneNo(Phoneno || '');
          setPhoto(Photo || '');
        } else {
          console.log('No such document!');
        }
      };

      fetchUserData();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check the valid mobile number
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

    // Check if all required fields are filled
    if (!Firstname || !Lastname || !DateofBirth || !Phoneno) {
      toast.error("Please fill in all required fields", {
        position: "bottom-center"
      });
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        let photoURL;
        if (typeof Photo !== 'string') {
          const imageRef = ref(storage, `images/${Photo.name + v4()}`);
          await uploadBytes(imageRef, Photo);
          photoURL = await getDownloadURL(imageRef);
        } else {
          photoURL = Photo;
        }

        // Update Firestore document
        await setDoc(doc(db, "User", user.uid), {
          Email: Email,
          Firstname: Firstname,
          Lastname: Lastname,
          DateofBirth: DateofBirth,
          CountryCode: CountryCode,
          Phoneno: Phoneno,
          displayName: `${Firstname} ${Lastname}`,
          Photo: photoURL
        });

        toast.success("Successfully Updated!!", {
          position: "top-center"
        });
        navigate("/view-profile");
      }
    } catch (error) {
      toast.error("Failed to Update: " + error.message, {
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
              <h6 
                onClick={() => navigate('/view-profile')}
                style={{ cursor: 'pointer' }}
              >
                &lt; back
              </h6>
              <h1 className="text-center mb-4">Update Profile</h1>
              <Form>
                <Form.Group id="Profile">
                <div className="mt-2 mb-2 text-center">
                  {Photo ? (
                    <img
                      src={typeof Photo === 'string' ? Photo : URL.createObjectURL(Photo)}
                      alt="User Profile"
                      style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                    />
                  ) : (
                    <img
                      src={Loading}
                      alt="Loading..."
                      style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                    />
                  )}
                </div>
                </Form.Group>
                <p className='text-center fs-6 fw-2'>Do you want to change your Profile picture?</p>
                <Form.Group id="ProfileImage">
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                </Form.Group>

                <Form.Group id="Email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={Email}
                    readOnly
                  />
                </Form.Group>
                <Form.Group id="Firstname">
                  <Form.Label>Firstname</Form.Label>
                  <Form.Control
                    type="text"
                    value={Firstname}
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
                    style={{ textTransform: 'capitalize' }}
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
                      <option value="+91">+91 (India)</option>
                      <option value="+1">+1 (USA)</option>
                      <option value="+44">+44 (UK)</option>
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
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-3">
            <Button type="submit" disabled={loading} onClick={handleSubmit}>Update</Button>
          </div>
        </>
      ) : (
        <Card style={{ backgroundColor: 'transparent', border: 'none' }}>
          <Card.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
            <img 
              src={Loading} 
              alt='Loading...'
              style={{ width: '100px' }}
            />
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default UpdateProfile;
