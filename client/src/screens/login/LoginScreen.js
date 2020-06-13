import React, {useState} from 'react'
import { Form, Button, Container } from 'react-bootstrap'
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../actions/authActions";

const LoginScreen = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  // Redirect if logged in
  if(isAuthenticated) {
    return <Redirect to="/category" />
  }

  return (
    <Container
      className='mx-auto d-block'
      style={{
        width: 500,
        marginTop: 80,
      }}
    >
      <Form>
        <Form.Group controlId='formBasicEmail'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
          />
        </Form.Group>
        <Form.Group controlId='formBasicPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={(e) => onChange(e)}
          />
        </Form.Group>
        <Button 
          variant='primary' 
          type='submit'
          onClick={onSubmit}
        >
          Login
        </Button>
      </Form>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
});

export default connect(mapStateToProps, { login })(LoginScreen);
