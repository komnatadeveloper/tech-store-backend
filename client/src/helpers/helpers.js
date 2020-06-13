
// Create Category Hierarchy
export const handleRawCategories = (rawCategories) => {
  let rawMainCategories = rawCategories.filter(
    (categoryItem) => categoryItem.isMainCategory === true
  );
  let rawSecondLevelCategories = rawCategories.filter(
    (categoryItem) => categoryItem.isSecondLevelCategory === true
  );
  let rawThirdLevelCategories = rawCategories.filter(
    (categoryItem) => categoryItem.isThirdLevelCategory === true
  );
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
  return mainCategories;
};
