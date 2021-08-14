const express = require('express');
const app = new express();

const dotenv = require('dotenv');
dotenv.config();

const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");
const {IamAuthenticator} = require("ibm-watson/auth");

// Create the service wrapper
const nlu = new NaturalLanguageUnderstandingV1({
    version: '2021-08-01',
    authenticator: new IamAuthenticator({
        apikey: process.env.API_KEY,
    }),
    serviceUrl: process.env.API_URL,
});

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
});

app.get("/url/emotion", (req,res) => {
    console.log("Emotion analyze for url: \n", req.query.url)
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'entities': {
                'emotion': true,
                'sentiment': false,
                'limit': 1,
            },
            'keywords': {
                'emotion': true,
                'sentiment': false,
                'limit': 1,
            },
        },
    };

    nlu.analyze(analyzeParams)
        .then(analysisResults => {
            console.log("Result: \n"+JSON.stringify(analysisResults, null, 2));
            console.log("Analysed part: \n"+JSON.stringify(
                analysisResults.result.entities[0].emotion, null, 2));
            return res.send(JSON.stringify(
                analysisResults.result.entities[0].emotion, null, 2));
        })
        .catch(err => {
            console.log('error:', err);
            return res.send({"error": err});
        });
});

app.get("/url/sentiment", (req,res) => {
    console.log("Sentiment analyze for url: \n", req.query.url)
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'entities': {
                'emotion': false,
                'sentiment': true,
                'limit': 1,
            },
            'keywords': {
                'emotion': false,
                'sentiment': true,
                'limit': 1,
            },
        },
    };

    nlu.analyze(analyzeParams)
        .then(analysisResults => {
            console.log("Result: \n"+JSON.stringify(analysisResults, null, 2));
            console.log("Analysed part: \n"+JSON.stringify(
                analysisResults.result.entities[0].sentiment.label, null, 2));
            return res.send(JSON.stringify(
                analysisResults.result.entities[0].sentiment.label, null, 2));
        })
        .catch(err => {
            console.log('error:', err);
            return res.send({"error": err});
        });
});

app.get("/text/emotion", (req,res) => {
    console.log("Emotion analyze for text: \n", req.query.text)
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'entities': {
                'emotion': true,
                'sentiment': false,
                'limit': 1,
            },
            'keywords': {
                'emotion': true,
                'sentiment': false,
                'limit': 1,
            },
        },
    };

    nlu.analyze(analyzeParams)
        .then(analysisResults => {
            console.log("Result: \n"+JSON.stringify(analysisResults, null, 2));
            console.log("Analysed part: \n"+JSON.stringify(
                analysisResults.result.entities[0].emotion, null, 2));
            return res.send(JSON.stringify(
                analysisResults.result.entities[0].emotion, null, 2));
        })
        .catch(err => {
            console.log('error:', err);
            return res.send({"error": err});
        });
});

app.get("/text/sentiment", (req,res) => {
    console.log("Sentiment analyze for text: \n", req.query.text)
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'entities': {
                'emotion': false,
                'sentiment': true,
                'limit': 1,
            },
            'keywords': {
                'emotion': false,
                'sentiment': true,
                'limit': 1,
            },
        },
    };

    nlu.analyze(analyzeParams)
        .then(analysisResults => {
            console.log("Result: \n"+JSON.stringify(analysisResults, null, 2));
            console.log("Analysed part: \n"+JSON.stringify(
                analysisResults.result.entities[0].sentiment.label, null, 2));
            return res.send(JSON.stringify(
                analysisResults.result.entities[0].sentiment.label, null, 2));
        })
        .catch(err => {
            console.log('error:', err);
            return res.send({"error": err});
        });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

