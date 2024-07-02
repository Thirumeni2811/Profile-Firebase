import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Card, Button } from 'react-bootstrap';
import { setDoc, doc, getDoc } from 'firebase/firestore'; 
import { db, auth, storage } from '../firebase';
import { toast } from 'react-toastify';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';

const UpdateProfile = () => {
  const [Firstname, setFirstname] = useState("");
  const [Lastname, setLastname] = useState("");
  const [DateofBirth, setDateofBirth] = useState("");
  const [Phoneno, setPhoneNo] = useState("");
  const [Email, setEmail] = useState("");
  const [Photo, setPhoto] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
          const userData = docSnap.data();
          setFirstname(userData.Firstname || '');
          setLastname(userData.Lastname || '');
          setDateofBirth(userData.DateofBirth || '');
          setPhoneNo(userData.Phoneno || '');
          setPhoto(userData.Photo || '');
        } else {
          console.log('No such document!');
        }
      };

      fetchUserData();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
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
                <img
                  src={Photo}
                  value={Photo}
                  alt="Profile Preview"
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
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
                value={currentUser.Email || ""}
                readOnly
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
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-3">
        <Button type="submit" disabled={loading} onClick={handleSubmit}>Update</Button>
      </div>
    </>
  );
};

export default UpdateProfile;
