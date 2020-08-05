
//For making API secreat keys hidden we use environment variables => npm install dotenv
//after that we create '.env' file without any prefix name and save for ex: API_KEY=12412412
//for accessing the api_key => process.env.API_KEY
const express=require('express');
// const { static } = require('express');
const dataStore = require('nedb');
const fetch = require('node-fetch');
const app=express()
// app.get('/',(req,res)=>{
//     res.render("index.html");
// })
const dataBase = new dataStore('database.db');
dataBase.loadDatabase();
app.listen(3000,()=>{
    console.log("listening 3000");
})
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));
// app.get('/',(req,res)=>{
//     console.log("came here");
//     res.render("index.html");
// });
app.get('/api',(req,res)=>{
    dataBase.find({} , (err,data)=>{
        if(err){
            res.end();
            return;
        }
        res.json(data);
    });
});
app.get('/weather/:latlon', async (req,res) =>{
    const latlon= req.params.latlon.split(',');
    console.log(latlon);
    const lat=latlon[0];
    const lon=latlon[1];
    // const api_url=`http://www.7timer.info/bin/astro.php?lon=${lon}&lat=${lat}&ac=0&unit=metric&output=json&tzshift=0`;
    const weather_url=`http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=civil&output=json`;
    const weather_resp = await fetch(weather_url);
    const weather_data= await weather_resp.json();

    //https://docs.openaq.org/ => organization that giving data for air quality
    const aq_url=`https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();
    
    const data = {
        weather : weather_data,
        air_quality : aq_data
    }
    res.json(data);
})
app.post('/geolocate',(req,res)=>{
    console.log("got till here");
    // console.log(req.body);
    // console.log(req.body.lat);
    const data=req.body;
    const timeStamp = Date.now();
    data.timeStamp=timeStamp;
    dataBase.insert(data);
    // console.log(dataBase);
    res.json(data);
    // console.log(req.body.sai);
});