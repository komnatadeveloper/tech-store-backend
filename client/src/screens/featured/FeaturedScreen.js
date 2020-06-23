import React, {useState, useEffect} from 'react'
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom'
import { Form, Button, Tab, Tabs } from 'react-bootstrap'
import { queryCategories } from '../../actions/categoryActions';
import { 
  getFilterListOfCategory,
  queryProducts,
} from '../../actions/productActions';
import { addFeature, fetchFeatures } from '../../actions/featureActions';
import { imageUrlHelper } from '../../helpers/helpers';
import  FeatureItem  from './FeatureItem';
import { FeaturedProductItem } from './FeaturedProductItem';

const FeaturedScreen = ({
  // from state
  queriedCategories,
  getFilterListOfCategory,
  queriedProducts,
  features,  
  isAuthenticated,
  appInitialised,
  // from actions
  queryCategories,
  addFeature,
  fetchFeatures,
  queryProducts
}) => {
  const initialFormData = {
    featureType: "",
    brand: "",
    productId: "",
    categoryId: '',
  };
  const [imageToAdd, setImageToAdd ] = useState(null);
  const [radioIndex, setRadioIndex ] = useState(0); // 0 or 1
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryQueryText, setCategoryQueryText] = useState("");
  const [productQueryText, setProductQueryText] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [isBrandListFetched, setIsBrandListFetched] = useState(false);
  const [brandList, setBrandList] = useState([]);
  const [selectedTab, setSelectedTab] = useState('add-feature-tab');  // 'add-feature-tab' || 'features-tab'
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchFeatures({
      callBack: () => {
        console.log('FeaturedScreen -> fetchFeatures -> callBack FIRED')
      }
    })
  }, [])

  const SelectBrandComponent =  () => {

    return (
      <div>
        <Form.Control 
          as="select"
          onChange= { e => {
            console.log(e.target.value)
            if( e.target.value === 'Select' ) {
              setFormData({
                ...formData,
                brand: '',
                featureType: 'category'
              })
            } else {
              setFormData({
                ...formData,
                brand: e.target.value,
                featureType: 'categoryWithBrand'
              })
            }
          }}

        >

          {
            brandList.map( brandItem => (
              <option
                key={brandItem}
              >
                {brandItem}
              </option>
            ) )
          }
        </Form.Control>
      </div>
    )
  }


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

  const AddCategoryFeatureComponent = () => {
    return (
      <div>
        {categoryTitle !== '' && (
          <div
            className='d-flex flex-row justify-content-between bg-warning'
          >
            <p className='my-auto'>{categoryTitle}</p>
            <Button
              variant='info'
              onClick={() => {
                setCategoryTitle('');
                setFormData({
                  ...formData,
                  categoryId: '',
                  featureType: ''
                })
                setIsBrandListFetched(false);
                setBrandList([]);
              }}
            >
              Edit Category
                  </Button>
          </div>
        )
        }
        {
          categoryTitle === '' && (
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
          )
        }
        {
          queriedCategories.length > 0 &&
          queriedCategories.map((categoryItem, index) => (
            <h3
              key={index}
              className='text-center border border-primary p-1 my-1'
              onClick={() => {
                // setFormData({
                //   ...formData,
                //   category: [categoryItem._id],
                // });
                setCategoryTitle(categoryItem.title);
                setFormData({
                  ...formData,
                  categoryId: categoryItem._id,
                  featureType: 'category'
                })
                setCategoryQueryText("");
                queryCategories("");
              }}
            >
              {categoryItem.title}
            </h3>
          ))
        }
        {
          (isBrandListFetched
            && categoryTitle !== '') && SelectBrandComponent()
        }
      </div>
    )
  }

  const AddProductFeatureComponent = () => {
    return (
      <div>
        {
          !selectedProduct && (
            <Form.Control
              type='text'
              placeholder='Search Products'
              name='categoryQueryText'
              value={productQueryText}
              onChange={(e) => {
                if( selectedProduct ) {
                  setSelectedProduct(null);
                }
                setProductQueryText(e.target.value);
                queryProducts({ search: e.target.value });
              }}
            />
          )
        }
        { 
          selectedProduct && (
            <div className='d-flex flex-row justify-content-end w-100'>
              <Button
                onClick={() => {
                  setSelectedProduct(null)
                }}
              >
                Change Product
              </Button>
            </div>
          )
        }
        {
          queriedProducts.length > 0 && (
            queriedProducts.map( productItem => (
              <FeaturedProductItem
                key={productItem._id}
                productItem={productItem}
                clickHandler= { ({product}) => {
                  setProductQueryText('')
                  queryProducts('')
                  setSelectedProduct(product);
                  setFormData({
                    ...formData,                    
                    productId: product._id
                  })
                }}
              />
            ) )
          )
        }
        {
          selectedProduct &&  (
            < FeaturedProductItem
              productItem={selectedProduct}
              clickHandler={({ product }) => {

              }}
            />
          )
          
        }
      </div>
    )
  }

  if( !isBrandListFetched && categoryTitle !== '' ) {
    getFilterListOfCategory({
      categoryId: formData.categoryId
    })
      .then( (result) => {
        console.log('FeaturedScreen -> getFilterListOfCategory -> result ->', result)
          setBrandList( ['Select', ...result.brandList] );
          setIsBrandListFetched(true)
        }
      )
  }
  if (!isAuthenticated && appInitialised) {
    return <Redirect to='/' />;
  }
  return (
    <div
      className='m-auto px-2 py-5'
      style={{
        maxWidth: "950px",
        minHeight: 500,
        backgroundColor: "#ddd",
      }}
    >
      <Tabs
        activeKey={selectedTab}
        onSelect={(k) => setSelectedTab(k)}
      >
        <Tab
          eventKey='add-feature-tab'
          title='Add Feature'
        >
          <h4>Add Feature</h4>
          <Form
            className='mb-3'
          >
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
            <div
              className='d-flex flex-row justify-content-center'
            >
              <div className='w-50 d-flex flex-column bg-primary'>
                <Form.Check
                  className='mr-4 mb-4'
                  type='radio'
                  label='Group of Products'
                  checked={radioIndex === 0}
                  onChange={(e) => {
                    if( radioIndex !== 0 ) {
                      setRadioIndex(0);
                      setSelectedProduct(null);
                      setProductQueryText('');
                      queryProducts('');
                      setFormData({
                        ...formData,
                        featureType: 'category',
                        productId: '',

                      })
                    }

                  }}
                />                


              </div>
              <div
                className='w-50 d-flex flex-column bg-danger'
              >
                <Form.Check
                  className='ml-4 mb-4'
                  type='radio'
                  label='Single Product'
                  checked={radioIndex === 1}
                  onChange={(e) => {
                    if (radioIndex !== 1) {
                      setRadioIndex(1);
                      setCategoryTitle('');
                      setCategoryQueryText('');
                      queryCategories('');
                      setIsBrandListFetched(false);
                      setBrandList([]);
                      setFormData({
                        ...formData,
                        featureType: 'product',
                        categoryId: '',
                        brand: ''

                      })
                    }
                  }}
                />

              </div>
            </div>
            {
              radioIndex === 0 && AddCategoryFeatureComponent()
            }
            {
              radioIndex === 1 && AddProductFeatureComponent()
            }
          </Form>
          <Button
            className='m-auto d-block px-5'
            onClick={() => {
              addFeature({
                formData,
                image: imageToAdd,
                callBack:  () => {
                  console.log('Client -> FeaturedScreen -> addFeature -> callBack FIRED')
                }
              })
            }}
          >
            Add Feature
          </Button>
        </Tab>
        <Tab
          eventKey='features-tab'
          title='Features'
        >
          <p>Features Tab</p>
          {
            features.length > 0 &&
            features.map(featureItem => (
              <FeatureItem
                key={featureItem._id}
                feature={featureItem}
              />
            ))
          }
        </Tab>
      </Tabs>
      
      
    </div>
  )
}

const mapStateToProps = (state) => ({
  queriedCategories: state.categoryReducer.queriedCategories,
  queriedProducts: state.productReducer.queriedProducts,
  appInitialised: state.authReducer.appInitialised,
  isAuthenticated: state.authReducer.isAuthenticated,
  features:  state.featureReducer.features,
});

export default connect(
  mapStateToProps, 
  { 
    queryCategories, 
    getFilterListOfCategory,
    queryProducts,
    addFeature,
    fetchFeatures
  }
)(FeaturedScreen);
