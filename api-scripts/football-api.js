/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios')
const fs = require("fs");

async function fetchFixtures(league, season, jsonfile) {
    try {
        
        const url = `https://v3.football.api-sports.io//fixtures?league=${league}&season=${season}&next=30`
        console.log(url)
        
        const response = await axios.get(url, {
            headers: {
                "x-apisports-key": "934a3a2862e166356537de2006196c1c",
                "x-api-key": "NBpevHxTq49QkyHgOTHjP3u26hVkhIZM8P4p10R5"
            }
        });

        const originalData = response.data;

        const modifiedData = {
            ...originalData,
            response: originalData.response.map(item => ({
              ...item,
              fixture: {
                ...item.fixture,
                sport: "football"
              }
            }))
          };
        let str = JSON.stringify(modifiedData);

        fs.writeFile(`./${jsonfile}.json`, str, function (error) {
            if (error) {
                console.log("Error");
            } else {
                console.log("Success");
            }
        });
        console.log(modifiedData)
        return modifiedData
    } catch (error) {
        console.log(error)
    }
}
setInterval(function () { fetchFixtures(39, "2023", "football"); }, 1000);
