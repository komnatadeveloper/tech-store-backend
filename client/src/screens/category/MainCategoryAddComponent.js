import React, { useState } from "react";
import { connect } from "react-redux";
import { addCategory } from "../../actions/categoryActions";

import { Form, Button } from "react-bootstrap";

const MainCategoryAddComponent = ({
  // from state
  // .....
  // from actions
  addCategory,
}) => {
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

        <Button
          variant='primary'
          onClick={() => {
            addCategory({
              formData: {
                title: title,
                isMainCategory: true,
                parentList: [],
              },
            });
          }}
        >
          Add Main Category
        </Button>
      </Form>
    </div>
  );
};

export default connect(null, { addCategory })(MainCategoryAddComponent);
