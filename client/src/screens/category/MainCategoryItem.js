import React, {useState} from 'react'
import { Button, Collapse, } from 'react-bootstrap'
import  SubCategoryAddComponent  from './SubCategoryAddComponent';
import { SubCategoryItem } from './SubCategoryItem';


export const MainCategoryItem = ({
  title,
  category,
  handleMainButtonClick
}) => {
  const [showAddSubCategory, setShowAddSubCategory] = useState(false);
  const [showSubCategoryList, setShowSubCategoryList] = useState(false);
  const { _id } = category;
  console.log("MainCategoryItem -> props -> category -> ", category);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1.5px solid blue",
        backgroundColor: "#333",
      }}
    >
      <div
        style={{
          padding: "0.75rem",
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
          borderBottom:
            (showAddSubCategory || showSubCategoryList) && "1px solid white",
        }}
      >
        <div
          className='d-flex'
        >
          <p
            style={{
              fontSize: 20,
            }}
            className='m-auto text-center font-weight-bold text-light'
          >
            {title}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Button
            aria-expanded={showAddSubCategory}
            aria-controls={`collapseAddSubItem${_id}`}
            timeout={1500}
            onClick={() => {
              setShowAddSubCategory(!showAddSubCategory);
            }}
          >            
            <div className='d-flex flex-row m-auto'>
              <span className='mr-2 text-center'>Add Sub Category</span>
              <i
                className={
                  showAddSubCategory
                    ? "fa fa-chevron-up  text-center m-auto"
                    : "fa fa-chevron-down text-center m-auto"
                }
              ></i>
            </div>
          </Button>
          <div
            style={{
              width: "2.5rem",
              display: "flex",
              justifyContent: "center",
              margin: "auto",
            }}
          >
            {category.secondLevelChildrenCategories.length > 0 && (
              <Button
                variant='link'
                className='ml-3'
                onClick={() => {
                  handleMainButtonClick();
                  setShowSubCategoryList(!showSubCategoryList);
                }}
              >
                <i
                  className={
                    showSubCategoryList
                      ? "fa fa-chevron-up text-light"
                      : "fa fa-chevron-down text-light"
                  }
                ></i>
              </Button>
            )}
          </div>
        </div>
      </div>
      <Collapse in={showAddSubCategory} timeout={1500}>
        <div
          id={`collapseAddSubItem${_id}`}
          style={{
            backgroundColor: "orange",
          }}
        >
          <SubCategoryAddComponent parentCategory={category} />
        </div>
      </Collapse>
      {showSubCategoryList &&
        category.secondLevelChildrenCategories.map(
          (secondLevelCategoryItem) => (
            <SubCategoryItem
              title={secondLevelCategoryItem.rawCategory.title}
              parentCategory={category.rawCategory}
              category={secondLevelCategoryItem}
            />
          )
        )}
    </div>
  );
}
