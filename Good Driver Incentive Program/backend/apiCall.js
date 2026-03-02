
const express = require('express');

const app = express();
//need to add queries by ?q=(insert terms)
app.get('/search', async (req, res) => {
    const searchTerm = req.query.q; 
    

    const url = new URL('https://api.etsy.com/v3/application/listings/active');
    url.searchParams.append('keywords', searchTerm);
    url.searchParams.append('limit', '10');

    const requestOptions = {
        method: 'GET',
        headers: {
            'x-api-key': '', //I am not sure we should put the api key in the public github repo so I left it out
            'Accept': 'application/json'
        },
    };

    const response = await fetch(url.toString(), requestOptions);
    const data = await response.json();

    /*here is the data, there are going to be a lot of fields, I would probably control+f " to see what fields each item has
    then use .map to create an array of the fields we want*/
    if (response.ok) {
        res.status(200).json(data.results);
    } else {
        res.status(response.status).json({ error: data });
    }

});


const port = 3003;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});