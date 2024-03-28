
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios')
const fs = require("fs");



async function fetchFixtures(league, season, jsonfile) {

    try {
        const url = `https://v1.rugby.api-sports.io/games?league=${league}&season=${season}`
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
              fixture: {
                id: item.id,
                date: item.date,
                time: item.time,
                timestamp: item.timestamp,
                timezone: item.timezone,
                week: item.week,
                status: item.status,
                sport: "rugby"
              },
              country: item.country,
              league: item.league,
              teams: item.teams,
              scores: item.scores,
              periods: item.periods
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

//world cup = 69
setInterval(function () { fetchFixtures(69, "2023", "rugby"); }, 1000);
