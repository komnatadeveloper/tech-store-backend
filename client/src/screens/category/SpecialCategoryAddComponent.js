import React, { useState } from "react";
import { connect } from "react-redux";
import { addCategory } from "../../actions/categoryActions";

import { Form, Button } from "react-bootstrap";

const SpecialCategoryAddComponent = ({
  // from state
  // .....
  // from actions
  addCategory,
}) => {
  const [title, setTitle] = useState("");
  const [imageToAdd, setImageToAdd] = useState(null);
  const [showOnHomePage, setShowOnHomePage] = useState(false)

  const ImageComponent = () => {
    const objectUrl = URL.createObjectURL(imageToAdd);
    return (
      <div>
        <img
          style={{
            width: 500,
            height: 325,
          }}
          className='mb-2'
          src={objectUrl}
        />
      </div>
    )
  }

  return (
    <div>
      <Form>
        <Form.Group controlId='formBasicEmail'>
          <Form.Label>Picture</Form.Label>
          <Form.Control
            type='file'
            placeholder='Select Image'
            name='image'
            onChange={(e) => {
              setImageToAdd(...e.target.files);
            }}
          />
        </Form.Group>
        {
          imageToAdd && ImageComponent()
        }
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
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check 
              type="checkbox" 
              label="Show on Home Page" 
              checked={showOnHomePage}
              onClick= { (e) => {
                setShowOnHomePage(!showOnHomePage);
              }}
            />
          </Form.Group>
        </Form.Group>

        <Button
          variant='primary'
          onClick={() => {
            addCategory({
              formData: {
                title: title,
                isSpecial: true,
                parentList: [],
                showOnHomePage,
              },
              image: imageToAdd,
              cb: () => {
                console.log('SpecialCategoryAddComponent -> addCategory -> callback FIRED');
                setImageToAdd(null);
                setTitle('');
              }
            });
          }}
        >
          Add Special Category
        </Button>
      </Form>
    </div>
  );
};

export default connect(null, { addCategory })(SpecialCategoryAddComponent);

