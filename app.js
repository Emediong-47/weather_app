import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;
const apiKey = process.env.API_KEY;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/premium", (req, res) => {
    res.render("premium");
})

app.post("/", async (req, res) => {
    try {
        const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
            params: {
                appid: apiKey,
                q: req.body.city,
                units: "metric"
            }
        });
        const data = response.data;
        res.render("index", {
            weatherInfo: data,
            weatherImage:`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        });
    } catch (error) {
        let errorMessage = "An error occurred.";
        if (error.response && error.response.data) {
            errorMessage = error.response.data.message || "An error occurred.";
        }
        res.render("index", {
            errorMessage
        });
    }
    
});

app.post("/premium", async (req, res) => {
    try {
        const response = await axios.get("https://api.openweathermap.org/data/2.5/forecast", {
            params: {
                appid: apiKey,
                q: req.body.city,
                units: "metric"
            }
        });
        const data = response.data;
        res.render("premium", {
            weatherInfo: data,
            // weatherImage:`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        });
    } catch (error) {
        let errorMessage = "An error occurred.";
        if (error.response && error.response.data) {
            errorMessage = error.response.data.message || "An error occurred.";
        }
        res.render("premium", {
            errorMessage
        });
    }
    
});

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
});