import React, { useState } from "react";
import { connect } from "react-redux";
import { addCategory } from "../../actions/categoryActions";

import { Form, Button } from "react-bootstrap";

const ThirdLevelCategoryAddComponent = ({
  // as Prop
  parentCategory,
  // from state
  // ....
  // from actions
  addCategory,
}) => {
  const [title, setTitle] = useState("");
  return (
    <div>
      <Form>
        <Form.Group controlId='formBasicEmail'>
          <Form.Label className='text-light'>3rd Level Title</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter 3rd Level Title'
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </Form.Group>        
        <Button
          variant='primary'
          onClick={() => {
            addCategory({
              formData: {
                title: title,
                isThirdLevelCategory: true,
                parentList: [parentCategory.rawCategory._id],
              },
            });
          }}
        >
          Add 3rd Level Category
        </Button>
      </Form>
    </div>
  );
};

export default connect(null, { addCategory })(ThirdLevelCategoryAddComponent);
