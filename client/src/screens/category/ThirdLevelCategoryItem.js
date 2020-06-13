import React from "react";

export const ThirdLevelCategoryItem = ({ title, parentCategory, category }) => {

  const { _id } = category;
  console.log(
    "ThirdLevelCategoryItem -> props -> parentCategory -> ",
    parentCategory
  );
  return (
    <div
      style={{
      backgroundColor:'#777'
      }}
      className='d-flex flex-column ml-4'
    >
      <div
        style={{
          padding: "0.75rem",
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
          }}
        >
          <p
            style={{
              margin: "auto",
              textAlign: "center",
              fontSize:16
              
            }}
            className='text-light'
          >
            {title}
          </p>
        </div>        
      </div>
    </div>
  );
};
