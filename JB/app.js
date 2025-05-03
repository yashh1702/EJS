const express = require('express')
const cookieParser = require('cookie-parser')
const app = express();

app.use(cookieParser())

app.get('/',(req,res) => {
    res.cookie('name','Yash')
    res.send("Done")
})

app.get('/read',(req,res) => {
    console.log(req.cookies);
    res.send("Read ")
})

app.listen(3000,() => {
    console.log(`App is listening at ${3000}`)
})