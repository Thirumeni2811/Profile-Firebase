import React, { useState, useEffect } from 'react';
import { useNavigate , Link} from 'react-router-dom';
import { Form, Card, Button } from 'react-bootstrap';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const ViewProfile = () => {
  const [currentUser, setCurrentUser] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'User', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCurrentUser(docSnap.data());
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchUserData();
  }, [currentUser]); 

  const handleUpdateProfile = () => {
    navigate('/update-profile');
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h6 
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            &lt; back
          </h6>
          <h1 className="text-center mb-4">Profile</h1>
          <Form>
            <Form.Group id="Profile">
              <div className="mt-2 mb-2 text-center">
                <img
                  src={currentUser.Photo}
                  value={currentUser.Photo}
                  alt="Loading..."
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
              </div>
            </Form.Group>
            <Form.Group id="Firstname">
              <Form.Label>Firstname</Form.Label>
              <Form.Control
                type="text"
                value={currentUser.Firstname || ""}
                style={{ textTransform: 'capitalize' }}
                readOnly 
              />
            </Form.Group>
            <Form.Group id="Lastname">
              <Form.Label>Lastname</Form.Label>
              <Form.Control
                type="text"
                style={{ textTransform: 'capitalize' }}
                value={currentUser.Lastname || ""}
                readOnly 
              />
            </Form.Group>
            <Form.Group id="DateofBirth">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={currentUser.DateofBirth || ""}
                readOnly 
              />
            </Form.Group>
            <Form.Group id="Phoneno">
              <Form.Label>Phone number</Form.Label>
              <div className='d-flex gap-2'>
                <Form.Control 
                  style={{width: "60px" , cursor: "pointer"}}
                  value={currentUser.CountryCode || ""}
                  readOnly
                />
                <Form.Control
                  type="text"
                  value={currentUser.Phoneno || ""}
                  readOnly 
                />
              </div>
            </Form.Group>
            <Form.Group id="Email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={currentUser.Email || ""}
                readOnly 
              />
            </Form.Group>
          </Form>
          <div className="w-100 text-center mt-3">
                <Link to="/forgot-password" className='text-decoration-none'>Forgot Password ?</Link>
            </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-3">
        <Button onClick={handleUpdateProfile}>Edit Profile</Button>
      </div>
      
    </>
  );
};

export default ViewProfile