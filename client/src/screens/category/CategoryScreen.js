import React, { useEffect, useState } from "react";
import {  Button, Container } from "react-bootstrap";
import {  Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { addCategory, getCategories } from "../../actions/categoryActions";
import { MainCategoryItem } from "./MainCategoryItem";
import MainCategoryAddComponent from "./MainCategoryAddComponent";
import SpecialCategoryAddComponent from "./SpecialCategoryAddComponent";
import { handleRawCategories } from "../../helpers/helpers";
import { SpecialCategoryItem } from "./SpecialCategoryItem";


const CategoryScreen = ({
  // from state
  categories,
  appInitialised,
  isAuthenticated,
  // from actions
  getCategories,
}) => {
  const [showAddMainCategory, setShowAddMainCategory] = useState(false);
  const [showAddSpecialCategory, setShowAddSpecialCategory] = useState(false);

  useEffect(() => {
    console.log(
      "CategoryScreen -> useEffect -> appInitialised ->",
      appInitialised
    );
    if (appInitialised) {
      getCategories();
    }
  }, [appInitialised]);

  const {
    mainCategories,
    specialCategories
   } = handleRawCategories(categories)

  

  if (!isAuthenticated && appInitialised) {
    return <Redirect to='/' />;
  }

  return (
    <Container
      className='mx-auto d-block'
      style={{
        width: 800,
        marginTop: 20,
        backgroundColor: "#ccc",
      }}
    >
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h4
          style={{
            textAlign: "center",
          }}
        >
          Categories
        </h4>
        <div
          className='d-flex flex-row justify-content-between'
        > 
          <Button
            onClick={() => {
              setShowAddMainCategory(!showAddMainCategory);
              setShowAddSpecialCategory(false);
            }}
          >
            Add Main Category
          </Button>
          <Button
            variant='dark'
            onClick={() => {
              setShowAddSpecialCategory(!showAddSpecialCategory);
              setShowAddMainCategory(false);
            }}
          >
            Add Special Category
          </Button>
        </div>
        {showAddMainCategory && <MainCategoryAddComponent />}
        {showAddSpecialCategory && <SpecialCategoryAddComponent />}
      </Container>
      {mainCategories.map((categoryItem) => {
        return (
          <MainCategoryItem
            key={categoryItem.rawCategory["_id"]}
            title={categoryItem.rawCategory.title}
            category={categoryItem}
            handleMainButtonClick={() => {
              console.log("Client -> CategoryScreen -> handleMainButtonClick");
            }}
          />
        );
      })}
      {
        specialCategories.length > 0 &&
        specialCategories.map( (specialCategoryItem) => (
          <SpecialCategoryItem
            key={specialCategoryItem.rawCategory["_id"]}
            title={specialCategoryItem.rawCategory.title}
            category={specialCategoryItem}
            handleMainButtonClick={() => {
              console.log("Client -> CategoryScreen -> handleMainButtonClick");
            }}
          />
        ) )
      }
    </Container>
  );
};

const mapStateToProps = (state) => ({
  categories: state.categoryReducer.categories,
  appInitialised: state.authReducer.appInitialised,
  isAuthenticated: state.authReducer.isAuthenticated,
});

export default connect(
  mapStateToProps, 
  { 
    getCategories,
    addCategory   
  }
)(CategoryScreen);
