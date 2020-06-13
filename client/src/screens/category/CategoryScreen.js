import React, { useEffect, useState } from "react";
import {  Button, Container } from "react-bootstrap";
import {  Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { addCategory, getCategories } from "../../actions/categoryActions";
import { MainCategoryItem } from "./MainCategoryItem";
import MainCategoryAddComponent from "./MainCategoryAddComponent";
import { handleRawCategories } from "../../helpers/helpers";


const CategoryScreen = ({
  // from state
  categories,
  appInitialised,
  isAuthenticated,
  // from actions
  getCategories,
}) => {
  const [showAddMainCategory, setShowAddMainCategory] = useState(false);

  useEffect(() => {
    console.log(
      "CategoryScreen -> useEffect -> appInitialised ->",
      appInitialised
    );
    if (appInitialised) {
      getCategories();
    }
  }, [appInitialised]);

  

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
        <Button
          onClick={() => {
            setShowAddMainCategory(!showAddMainCategory);
          }}
        >
          Add Main Category
        </Button>
        {showAddMainCategory && <MainCategoryAddComponent />}
      </Container>
      {handleRawCategories(categories).map((categoryItem) => {
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
