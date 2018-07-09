
    // https://api.pdflayer.com/api/convert?access_key=6f976b9baaede103c03c9763adf6e9fd&document_html=<p>Hello</p>>&test=1

const createMealPlanOnlyPdf = () => {
    // $.getJSON(
    //     `https://api.pdflayer.com/api/convert?access_key=6f976b9baaede103c03c9763adf6e9fd&document_url=downloadUrl,
    //     {
    //         access_key: access_key='6f976b9baaede103c03c9763adf6e9fd',
    //         test: 1,
    //         document_url: 'https://github.com/aleyesa/Meal-Plan-O/blob/master/index.html',
    //     }, (data) => console.log(data)
    //     );

    //     $('.meal-table-section').on('click', '.pdfBtn', () => {
        

    // }   
    // $('.meal-table-section').on('click', '.pdfBtn', () => {
        $.ajax(
            {
            method: 'POST',
            url: 'https://api.pdflayer.com/api/convert?access_key=6f976b9baaede103c03c9763adf6e9fd&test=1',
            data: {
                document_html: '<!DOCTYPE html><html><head><title>Meal Plan</title></head><body><p>Hello</p></body></html>',
            },
            success: (data, a ,xhr) => {
                let downloadLink      = document.createElement('a');
                downloadLink.target   = '_blank';
                downloadLink.download = 'name_to_give_saved_file.pdf';
              
                // convert downloaded data to a Blob
                let blob = new Blob([data], { type: 'application/pdf' });
              
                // create an object URL from the Blob
                let URL = window.URL || window.webkitURL;
                let downloadUrl = URL.createObjectURL(blob);
                console.log(blob);
                $('meal-table-section a').attr('href', `https://api.pdflayer.com/api/convert?access_key=6f976b9baaede103c03c9763adf6e9fd&document_url=http://localhost:8080/69d0476a-8b71-4e77-af84-28066a79c5ca`);
                // set object URL as the anchor's href
                // downloadLink.href = downloadUrl;
              
                // // append the anchor to document body
                // document.body.append(downloadLink);
              
                // // fire a click event on the anchor
                // downloadLink.click();
              
                // // cleanup: remove element and revoke object URL
                // document.body.removeChild(downloadLink);
                // URL.revokeObjectURL(downloadUrl);

            }
        });
    };

            $(mealSection).parent().closest('section').replaceWith(`<p>${foodItemToAdd}<button class="removeFoodItem">x</button> </p>
            <section><button class="addFoodBtn">+</button></section>`);
            $('.search-add-section').css('display', 'none');
            $('.search-results').empty();
            add = '';
            $('.meal-table-section').css('display', 'block');
    });    
});
};
//remove food item
const removeFoodItem = () => {
$('.meal-table-section').on('click', '.removeFoodItem', function(event) {
    console.log($(this).parent().remove());
});
};
//Navigate back to table
const goBackToTable = () => {
$('.search-add-section').on('click', '.tableBtn', () => {    
    $('.search-add-section').css('display', 'none');
    $('.search-results').empty();
    add = '';
    $('.meal-table-section').css('display', 'block');
});
};
//resets meal plan
const resetMealPlan = () => {
$('.meal-table-section').on('click', '.resetTableBtn', () => {
    $('.delete-prompt').css('display', 'block');
    $('.delete-prompt').on('click', '.exitBtn', () => $('.delete-prompt').css('display', 'none'));
    $('.delete-prompt').on('click', '.proceedBtn', () => $('.meal-table-section').html(mealTableHtml));
});
};
//Food Search API sends keyword queries and returns lists of foods which contain one or 
//more of the keywords in the food description, scientific name, or commerical name fields.
const handleFoodSearchRequest = (nameOfFood, offset) => {
    const ndbSearchEndpoint = 'https://api.nal.usda.gov/ndb/search';
    const requestParam = {
        api_key: 'Dque88jiOSae3F2qrzzsBSqCYrNxXMn5iydg3NLe',
        q: nameOfFood,
        offset: offset,
        max: 10
    };
    $.getJSON(ndbSearchEndpoint, requestParam, (data) => {
        totalResults = data.list.total;
        $('.search-add-section').find('.totalResults').html(`Found ${totalResults} results for ${currentFoodSearch}`);
        const foodSearchResults = data.list.item.map((results) => {
            handleFoodReportRequest(results.name, results.ndbno);
        });
    });
};
//Food Report API is a list of nutrients and their values in various portions for a specific food.
const handleFoodReportRequest = (foodName, ndbno) => {
    const foodReportEndpoint = 'https://api.nal.usda.gov/ndb/V2/reports';
    let addP = '';
    const requestParam = {
        api_key: 'Dque88jiOSae3F2qrzzsBSqCYrNxXMn5iydg3NLe',
        ndbno: ndbno,
    };
    $.getJSON(foodReportEndpoint, requestParam, (data) => {
        for(let i = 1; i < 5; i++)
        {
            addP += ('<p>' + data.foods[0].food.nutrients[i].name + ': ' + 
                     data.foods[0].food.nutrients[i].value + ' ' +
                     data.foods[0].food.nutrients[i].unit + '</p>');
        }
        add += renderResult(foodName, addP);
        $('.search-results').html(add);
    });
};
//holds the html to display food item results
const renderResult = (foodName, macros) => {
    return `
    <div class="dropdown">
    <a href="#" class="foodName">${foodName}</a>
        <div class="dropdown-content">
        <strong><u>Macros</u></strong>
        ${macros}
        <button class="addBtn">Add</button>
        </div>
    </div>
    `;
  };
//Gets user input from search text field and sends it to food search request
const handleSearch = () => {
    $('.search-form').on('submit', function(event) {
        event.preventDefault();
        //empties food search results when user submits a new search
        add = '';
        totalResults = 0;
        //start search results list at the beginning
        offset = 0;
        const query = $(this).find('.js-query');
        const foodItem = $(this).find('.js-query').val();
        //holds current food search item to use within the file
        currentFoodSearch = foodItem;
        // clear out the input
        query.val('');
        handleFoodSearchRequest(foodItem, offset);
    });
};
//loads more search results when user clicks load button
const loadMoreResults = () => {
$('.search-add-section').on('click', '.loadBtn', function(event) {
    if(currentFoodSearch === ''){
        console.log('no food item searched');
    }else if(offset > totalResults){
        console.log('offset is higher than totalResults');
    }else{
        offset += 10;
        handleFoodSearchRequest(currentFoodSearch, offset);
    }
});
};
//main run function
const runApplication = () => {
    specifyTabAndShowSection();
    addMealSection();
    removeMealSection();
    addFoodItem();
    removeFoodItem();
    goBackToTable();
    resetMealPlan();
    handleSearch();
    loadMoreResults();
};
//invoke run application
runApplication();

// Search Section Tester
// $('.search-results').html(renderResult('Burger', 
//     `<p>Energy: 282 kcal</p>
//      <p>Protein: 16.83 g</p>
//      <p>Total lipid (fat): 16.13 g</p>
//      <p>Carbohydrate, by difference: 17.43 g</p>`));

createMealPlanOnlyPdf();





  
  