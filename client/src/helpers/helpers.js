
// Create Category Hierarchy
export const handleRawCategories = (rawCategories) => {
  let rawSpecialCategories = rawCategories.filter(
    (categoryItem) => categoryItem.isSpecial === true
  );
  let rawMainCategories = rawCategories.filter(
    (categoryItem) => categoryItem.isMainCategory === true
  );
  let rawSecondLevelCategories = rawCategories.filter(
    (categoryItem) => categoryItem.isSecondLevelCategory === true
  );
  let rawThirdLevelCategories = rawCategories.filter(
    (categoryItem) => categoryItem.isThirdLevelCategory === true
  );
  let specialCategories = [];
  for (let i = 0; i < rawSpecialCategories.length; i++) {
    let specialCategoryItem = {
      rawCategory: rawSpecialCategories[i],
    };
    specialCategories.push(specialCategoryItem);
  }

  let mainCategories = [];
  for (let i = 0; i < rawMainCategories.length; i++) {
    let mainCategoryItem = {
      rawCategory: rawMainCategories[i],
    };
    let secondLevelRawChildrenCategories = rawSecondLevelCategories.filter(
      (categoryItem) =>
        categoryItem.parentList.indexOf(rawMainCategories[i]._id) >= 0
    );
    let secondLevelChildrenCategories = [];
    for (let j = 0; j < secondLevelRawChildrenCategories.length; j++) {
      let secondCategoryItem = {
        rawCategory: secondLevelRawChildrenCategories[j],
      };
      secondCategoryItem.thirdLevelChildrenCategories = rawThirdLevelCategories.filter(
        (categoryItem) =>
          categoryItem.parentList.indexOf(
            secondLevelRawChildrenCategories[j]._id
          ) >= 0
      );
      secondLevelChildrenCategories.push(secondCategoryItem);
    }
    mainCategoryItem.secondLevelChildrenCategories = secondLevelChildrenCategories;
    mainCategories.push(mainCategoryItem);
  }
  console.log(
    "CategoryScreen -> handleRawCategories -> mainCategories ->",
    mainCategories
  );
  return {
    mainCategories,
    specialCategories
  };
};



export const imageUrlHelper =  ({ imageId }) => {
  return '/api/product/images/' + imageId;
}
export const mainImageUrlHelper =  ({ imageList }) => {
  const mainImageId = imageList.filter(
    imageItem => imageItem.isMain === true
  )[0].imageId
  return '/api/product/images/' + mainImageId;
}
export const mainImageIdHelper =  ({ imageList }) => {
  return  imageList.filter(
    imageItem => imageItem.isMain === true
  )[0].imageId
}


