import React, { useState} from 'react'
import { connect } from "react-redux";
import { addCategory } from '../../actions/categoryActions';

import {
  Form, Button
} from 'react-bootstrap'

const SubCategoryAddComponent = ({
  // as prop
  parentCategory,
  // from state
  // ....
  // from actions
  addCategory,
}) => {
  // console.log(parentCategory)
  const [title, setTitle] = useState("");
  return (
    <div>
      <Form>
        <Form.Group controlId='formBasicEmail'>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Title'
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </Form.Group>

        {/* <Form.Group controlId='formBasicPassword'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' placeholder='Password' />
        </Form.Group>
        <Form.Group controlId='formBasicCheckbox'>
          <Form.Check type='checkbox' label='Check me out' />
        </Form.Group> */}
        <Button
          variant='primary'
          // type='button'
          onClick={() => {
            addCategory({
              formData: {
                title: title,
                isSecondLevelCategory: true,
                parentList: [parentCategory.rawCategory._id],
              },
            });
          }}
        >
          Add Sub Category
        </Button>
      </Form>
    </div>
  );
};



export default connect(null, { addCategory })(SubCategoryAddComponent);
