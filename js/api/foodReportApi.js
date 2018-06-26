const handleFoodReportRequest = (foodName, ndbno) => {
  const foodReportEndpoint = 'https://api.nal.usda.gov/ndb/V2/reports';
  let addMacroInfo = '';

  const requestParam = {
    api_key: 'Dque88jiOSae3F2qrzzsBSqCYrNxXMn5iydg3NLe',
    ndbno: ndbno,
  };

  $.getJSON(foodReportEndpoint, requestParam, (data) => {
    const nutrients = { cals: '208', pros: '205', fats: '204', carbs: '203' };
    const nutrientType = ['calories', 'proteins', 'fats', 'carbohydrates'];
    let index = 0;

    for (let i = 0; i < data.foods[0].food.nutrients.length; i++) {
      const foodItemNutrients = data.foods[0].food.nutrients[i].nutrient_id;

      for (let nutrientId in nutrients) {
        if (foodItemNutrients === nutrients[nutrientId]) {
          addMacroInfo += (macroInfoTemplateForResults(data, i, nutrientType[index]));
          index++;
        }
      };
  }
    combineResultsHtml += displayResultHtml(foodName, addMacroInfo);

    $('.search-results').html(combineResultsHtml);
});
};