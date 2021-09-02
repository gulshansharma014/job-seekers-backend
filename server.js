import express from 'express'
import Mongoose from 'mongoose'
import Cors from 'cors'
import Jobs from './jobsCard.js'
import request from 'request'
import cheerio from 'cheerio'
import dotenv from 'dotenv'


// app Config
const app = express();
dotenv.config({path: './config.env'});
const port = process.env.PORT;
const connectionURL = process.env.URL;

// middleware
app.use(express.json());
app.use(Cors());

// db config
Mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connection successful");
    
}).catch(err => {
    console.log(err);
})


// API endpoint
app.get("/", (req, res) => res.status(200).send("HELLO, WELCOME TO BACKEND"));
const role = "Web Developer";
const url = `https://in.indeed.com/${role}-jobs-in-Delhi,-Delhi`;
request(url, (err, res, html) => {
    if(err) {
        console.log(err);
    }
    else {
        let $ = cheerio.load(html);
        let roleNameArr = $(".jobTitle.jobTitle-color-purple>span");
        let companyNameArr = $(".companyName");
        let descriptionArr = $(".job-snippet");
        let salaryArr = $(".salary-snippet");

        for(let i=0; i<roleNameArr.length; i++){
            let roleName = $(roleNameArr[i]).text();
            let companyName = $(companyNameArr[i]).text();
            let salary = $(salaryArr[i]).text();
            let description = $(descriptionArr[i]).text();

            const jobsCard = {
                "roleName" : roleName,
                "companyName" : companyName,
                "salary" : salary,
                "description" : description
            }
            Jobs.create(jobsCard, (err, data) => {
                if(err){
                    console.log(err);
                } else {
                    // res.status(201).send(data);
                }
            })

            
            // console.log("roleName : ", roleName);
            // console.log("companyName : ", companyName);
            // console.log("description : ", description);
            // console.log("salary : ", salary);
            // console.log("==============================================================================");
            // console.log("==============================================================================");
        }

    }
})



// app.post("/jobs", (req, res) => {
//     const jobsCard = req.body;

//     Jobs.create(jobsCard, (err, data) => {
//         if(err){
//             res.status(500).send(err);
//         } else {
//             res.status(201).send(data);
//         }
//     })
// })
app.get("/jobs", (req, res) => {
    Jobs.find( (err, data) => {
        if(err){
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
    // console.log("on jobs page");
})

// listener
app.listen(port, () => console.log(`listening on localhost: ${port}`));