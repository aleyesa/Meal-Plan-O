const htmlUrlToPdfApiEndpoint = 'https://api.pdflayer.com/api/convert';

const handleRequest = (endpoint, url) => {
    const requestParam = {
        access_key: '6f976b9baaede103c03c9763adf6e9fd',
        document_url: url
    }
    $.getJSON(endpoint, requestParam);
};

const convertUrlHtmlToPdf = (data) => {
    $('.pdfBtn').on('click', () => {
    $('.meal-table-section a').attr('href', 'https://api.pdflayer.com/api/convert?access_key=6f976b9baaede103c03c9763adf6e9fd&document_url=https://aleyesa.github.io/Meal-Plan-O/');
    }); 
};

convertUrlHtmlToPdf();

// const convertApiEndpoint = 'https://api.cloudmersive.com';
// $.ajax({
//     url: 'https://api.cloudmersive.com/convert/web/url/to/pdf',
//     type: 'post',
//     headers: {
//         Apikey: 'abe9fe54-29ff-466f-83d9-f884a2d36890'
//     },
//     'Url': 'https://aleyesa.github.io/Meal-Plan-O/',
//     "ExtraLoadingWait": 0,
//     dataType: 'json',
//     success: function (data) {
//         console.info(data);
//     }
// });





