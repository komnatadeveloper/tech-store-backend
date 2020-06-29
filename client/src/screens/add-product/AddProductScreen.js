import React, {useState} from 'react'
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { addProduct } from '../../actions/productActions';
import { queryCategories, querySpecialCategories } from '../../actions/categoryActions';


const AddProductScreen = ({
  // from state
  queriedCategories,
  isAuthenticated,
  appInitialised,
  // from actions
  addProduct,
  queryCategories,
  querySpecialCategories
}) => {
  const initialFormData = {
    brand: "",
    productNo: "",
    keyProperties: "",
    price: "",
    specifications: [],
    mainImageIndex: 0,
    category: [],
  };
  const [formData, setFormData] = useState(initialFormData);
  const [imageList, setImageList] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [specialCategoryTitle, setSpecialCategoryTitle] = useState('');
  const[specialCategory, setSpecialCategory] = useState([]);
  // const [categoryItem, setCategoryItem] = useState(null);
  const [categoryQueryText, setCategoryQueryText] = useState("");
  const [specialCategoryQueryText, setSpecialCategoryQueryText] = useState("");
  const [showAddSpecialCategory, setShowAddSpecialCategory] = useState(false);
  const [specialCategoryList, setSpecialCategoryList] = useState([]);
  const {
    brand,
    productNo,
    category,
    keyProperties,
    price,
    specifications,
    mainImageIndex,
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
          <Form.Label>Picture</Form.Label>
          <Form.Control
            type='file'
            placeholder='Select Image'
            name='image'            
            multiple
            onChange={(e) => {
              setImageList([...imageList, ...e.target.files]);
            }}
          />
        </Form.Group>
        {imageList.length > 0 && (
          <div
            className='d-flex flex-row'
            style={{
              overflowX: "scroll",
            }}
          >
            {imageList.map((imageItem, index) => {
              const objectUrl = URL.createObjectURL(imageItem);
              return (
                <div
                  className='px-4 pt-4 pb-2 d-flex flex-column align-items-center border border-info mx-2 mb-3'
                  key={index}
                >
                  <img
                    style={{
                      width: 300,
                      height: 225,
                    }}
                    className='mb-2'
                    src={objectUrl}
                  />
                  <Form.Group controlId='formBasicCheckbox'>
                    <Form.Check
                      type='checkbox'
                      label={
                        index === mainImageIndex ? "Main Image" : "Set Main"
                      }
                      checked={index === mainImageIndex}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          mainImageIndex: index,
                        });
                      }}
                    />
                  </Form.Group>
                  <Button
                    variant='danger'
                    onClick={() => {
                      let tempImageList = [...imageList];
                      tempImageList.splice(index, 1);
                      if (
                        mainImageIndex === imageList.length - 1 &&
                        mainImageIndex !== 0
                      ) {
                        setFormData({
                          ...formData,
                          mainImageIndex: formData.mainImageIndex - 1,
                        });
                      }
                      setImageList([...tempImageList]);
                    }}
                  >
                    <i className='fa fa-trash' />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <Form.Group controlId='formBasicEmail'>
          <div className='d-flex flex-row justify-content-between'>
            <div 
              className='d-flex flex-row justify-content-start my-auto'
            >
              <Form.Label className='my-auto'>Category:</Form.Label>
              <Form.Label className='ml-4 my-auto font-weight-bold'>{categoryTitle}</Form.Label>
            </div>
            {
              categoryTitle !== '' && (
                <Button
                onClick={() => {
                  setCategoryTitle('');
                  setFormData({
                    ...formData,
                    category: [],
                  })
                  setCategoryQueryText('');
                  queryCategories('');
                }}
                >
                  Edit Category
                </Button>
              )
            }
          </div>
          {
            categoryTitle.toString() === '' && (
              <React.Fragment>
                <Form.Control
                  type='text'
                  placeholder='Search Categories'
                  name='categoryQueryText'
                  value={categoryQueryText}
                  onChange={(e) => {
                    setCategoryQueryText(e.target.value);
                    queryCategories(e.target.value);
                  }}
                />
                {queriedCategories.length > 0 &&
                  queriedCategories.map((categoryItem, index) => (
                    <h3
                      key={index}
                      className='text-center border border-primary p-1 my-1'
                      onClick={() => {
                        setFormData({
                          ...formData,
                          category: [categoryItem._id],
                        });
                        setCategoryTitle(categoryItem.title);
                        setCategoryQueryText("");
                        queryCategories("");
                      }}
                    >
                      {categoryItem.title}
                    </h3>
                  ))}
              </React.Fragment>
            )
          }          
        </Form.Group>
        {
          !showAddSpecialCategory && (
            <Button
              className='mb-3'
              onClick={() => {
                setShowAddSpecialCategory(!showAddSpecialCategory);
              }}
            >
              Add Special Category
            </Button>
          )
        }
        {
          showAddSpecialCategory && (
            <div className='d-flex flex-row align-items-center mb-3'>
              <div className='flex-fill'>
                {
                  specialCategoryTitle === '' && (                  
                    <Form.Control
                      type='text'
                      placeholder='Search Special Categories'
    
                      name='categoryQueryText'
                      value={specialCategoryQueryText}
                      onChange={(e) => {
                        setSpecialCategoryQueryText(e.target.value);
                        querySpecialCategories(e.target.value)
                          .then(res => {
                            setSpecialCategoryList(res)
                          })
                      }}
                    />
                  )
                }
                {
                  specialCategoryTitle !== '' && (
                    <div className='my-auto'>
                      <Form.Label className='my-auto'>Special Category:</Form.Label>
                      <Form.Label className='ml-4 my-auto font-weight-bold'>{specialCategoryTitle}</Form.Label>
                    </div>
                  )
                }
              </div>


              
              <div  className=' d-flex flex-row'>
                {
                  specialCategoryTitle !== '' && (
                    <Button 
                      className='mr-2'
                      onClick={() => {
                        console.log('Edit Special Cat')
                        setSpecialCategoryTitle('');
                        setSpecialCategory([]);
                      }}
                    >
                      Edit Special Cat
                    </Button>
                  )
                }
                <Button
                  className='d-block'
                  variant='danger'
                  onClick={() => {
                    setSpecialCategory([]);
                    querySpecialCategories('');  
                    setSpecialCategoryTitle('');
                    setShowAddSpecialCategory(!showAddSpecialCategory);                 
                  }}
                >
                  Close Special 
                </Button>
              </div>
            </div>
          )
        }
        {specialCategoryList.length > 0 &&
          specialCategoryList.map((categoryItem, index) => (
            <h3
              key={index}
              className='text-center border border-primary p-1 my-1'
              onClick={() => {
                setSpecialCategory([categoryItem._id]);
                setSpecialCategoryTitle(categoryItem.title);
                setSpecialCategoryQueryText("");
                setSpecialCategoryList([])
              }}
            >
              {categoryItem.title}
            </h3>
          ))}
          {
          specialCategoryList.length > 0 && (
            <div className='mb-3'></div>
          )
          }
        <Form.Group controlId='formBasicEmail'>
          <Form.Label>Brand</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Brand'
            name='brand'
            value={brand}
            onChange={(e) => onChange(e)}
          />
        </Form.Group>
        <Form.Group controlId='formBasicPassword'>
          <Form.Label>Product No</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Product No'
            name='productNo'
            value={productNo}
            onChange={(e) => onChange(e)}
          />
        </Form.Group>
        <Form.Group controlId='formBasicPassword'>
          <Form.Label>Key Properties</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Key Properties'
            name='keyProperties'
            value={keyProperties}
            onChange={(e) => onChange(e)}
          />
        </Form.Group>
        <Form.Group controlId='formBasicPassword'>
          <Form.Label>Price</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Price'
            name='price'
            value={price}
            onChange={(e) => onChange(e)}
          />
        </Form.Group>
        <h4>Technical Specifications</h4>
        {specifications.length > 0 &&
          specifications.map((specificationItem, index) => (
            <Form.Group controlId='formBasicPassword'>
              <div className='d-flex flex-row justify-content-between'>
                <Form.Control
                  type='text'
                  placeholder='Enter Key'
                  value={specificationItem.key}
                  onChange={(e) => {
                    let tempArray = [...specifications];
                    tempArray[index].key = e.target.value;
                    setFormData({
                      ...formData,
                      specifications: [...tempArray],
                    });
                  }}
                />
                <Form.Control
                  type='text'
                  placeholder='Enter Value'
                  value={specificationItem.value}
                  onChange={(e) => {
                    let tempArray = [...specifications];
                    tempArray[index].value = e.target.value;
                    setFormData({
                      ...formData,
                      specifications: [...tempArray],
                    });
                  }}
                />
              </div>
            </Form.Group>
          ))}
        <Button
          onClick={() => {
            setFormData({
              ...formData,
              specifications: [
                ...formData.specifications,
                {
                  key: "",
                  value: "",
                },
              ],
            });
          }}
        >
          Add Technical Specification
        </Button>

        <Button
          variant='primary'
          type='submit'
          className='w-100 mt-5'
          onClick={(e) => {
            e.preventDefault();
            console.log("Client -> AddProductScreen -> formData ->", formData);
            addProduct({
              formData: {
                ...formData,
                price: parseFloat(formData.price),
                category: [
                  ...category,
                  ...specialCategory
                ]
              },
              imageList,
              callBack: () => {
                setFormData(initialFormData);
                setCategoryTitle('');
                setImageList([]);
                setSpecialCategory([]);
                setSpecialCategoryTitle('');
                setSpecialCategoryList([]);
                setSpecialCategoryQueryText('');
              },
            });
          }}
        >
          Add Product
        </Button>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  queriedCategories: state.categoryReducer.queriedCategories,
  appInitialised: state.authReducer.appInitialised,
  isAuthenticated: state.authReducer.isAuthenticated,
});



export default connect(
  mapStateToProps, 
  { 
    addProduct, 
    queryCategories,
    querySpecialCategories
  }
)(AddProductScreen);
