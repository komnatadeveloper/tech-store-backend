import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { addSupplier } from "../../actions/supplierActions";


const AddSupplierScreen = ({
  // from state
  appInitialised,
  isAuthenticated,
  // from actions
  addSupplier
}) => {

  const initialFormData = {
    email: '',
    name: "",
    middleName: "",
    surName: "",
    address: '',

  };
  const [formData, setFormData] = useState(initialFormData);
  const { 
    email,
    name,
    middleName,
    surName,
    address,
  } = formData;



  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  if (!isAuthenticated && appInitialised) {
    return <Redirect to='/' />;
  }
  return (
    <div
      style={{
        maxWidth: "950px",
        backgroundColor: "#ddd",
      }}
      className='m-auto p-2'
    >
      <Form>
        <Form.Group controlId='formBasicEmail'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter Email'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
          />
        </Form.Group>
        <Form.Group controlId='formBasicEmail'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Name'
            name='name'
            value={name}
            onChange={(e) => onChange(e)}
          />
        </Form.Group>
        <Form.Group controlId='formBasicEmail'>
          <Form.Label>Middlename</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Middlename'
            name='middleName'
            value={middleName}
            onChange={(e) => onChange(e)}
          />
        </Form.Group>
        <Form.Group controlId='formBasicEmail'>
          <Form.Label>Surname</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Surname'
            name='surName'
            value={surName}
            onChange={(e) => onChange(e)}
          />
        </Form.Group>
        <Form.Group controlId='formBasicEmail'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Address'
            name='address'
            value={address}
            onChange={(e) => onChange(e)}
          />
        </Form.Group>        
      </Form>
      <Button
        variant='primary'
        type='submit'
        className='w-100 mt-5'
        onClick={(e) => {
          e.preventDefault();
          console.log("Client -> AddProductScreen -> formData ->", formData);
          addSupplier({
            formData: {
              ...formData,
            },
            callBack: () => {
              // setFormData(initialFormData);
              // setCategoryTitle('');
              // setImageList([]);
              // setSpecialCategory([]);
              // setSpecialCategoryTitle('');
              // setSpecialCategoryList([]);
              // setSpecialCategoryQueryText('');
            },
          });
        }}
      >
        Add Product
        </Button>
    </div>
  )
}


const mapStateToProps = (state) => ({
  // categories: state.categoryReducer.categories,
  appInitialised: state.authReducer.appInitialised,
  isAuthenticated: state.authReducer.isAuthenticated,
});

export default connect(
  mapStateToProps,
  {

    addSupplier
  }
)(AddSupplierScreen);
