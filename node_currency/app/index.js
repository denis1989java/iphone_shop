const express = require('express');
const rp = require('request-promise');
const app = express();
app.get('/nodeapi/v1/currency',(req,res)=> {
    rp({
        uri:'https://api.fixer.io/latest?base=USD',
        json:true
    })
        .then((data)=>{
            res.send(JSON.stringify(data))
        })
        .catch((err)=>{
            res.send("Error")
        })
});
app.listen(3000);
