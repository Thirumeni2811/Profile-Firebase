import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Card, Button } from 'react-bootstrap';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import Loading from '../Loading.svg';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';

const Message = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();
    
        emailjs.sendForm('service_i3cr4h4', 'template_vx0ci07', form.current, 'GKdZp4bEf5pU6VOOp')
            .then(() => {
                console.log('SUCCESS!');
                toast.success("Message sent successfully", {
                    position: 'top-center'
                });
                navigate("/"); // Navigate after the email is sent successfully
            }, (error) => {
                console.log('FAILED...', error.text);
                toast.error(`FAILED: ${error.text}`, {
                    position: 'bottom-center'
                });
            });
    };

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
    }, []);

    return (
        <div>
            {currentUser ? (
                <Card>
                    <Card.Body>
                        <h6 
                            onClick={() => navigate('/')}
                            style={{ cursor: 'pointer' }}
                        >
                            &lt; back
                        </h6>
                        <h1 className="text-center mb-4">Message</h1>
                        <Form ref={form} onSubmit={sendEmail}>
                            <Form.Group id="from_name">
                                <Form.Label>From Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="from_name"
                                    value="Admin"
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group id="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={currentUser.displayName || ""}
                                    style={{ textTransform: 'capitalize' }}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={currentUser.email || ""}
                                    readOnly
                                />
                            </Form.Group>
                            <Form.Group id="subject">
                                <Form.Label>Subject</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="subject"
                                />
                            </Form.Group>
                            <Form.Group id="message">
                                <Form.Label>Message</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="message"
                                />
                            </Form.Group>
                            <Button className="btn btn-primary w-100 mt-3" type="submit">Send Message</Button>
                        </Form>
                    </Card.Body>
                </Card>
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
}

export default Message;
