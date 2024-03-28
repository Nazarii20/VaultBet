const axios = require('axios')
const fs = require("fs");

const hour =  3_600_000
const halfHour = 18_0000
const min = 6_000

async function fetchFixtures(league, season, jsonfile) {
    var today = new Date();
    var fourMonthsAway = new Date(Date.now() + 1051e7).toISOString().slice(0, 10);
    try {
        const url = `https://v1.basketball.api-sports.io/games?league=${league}&season=${season}`
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
                sport: "basketball"
              },
              country: item.country,
              league: item.league,
              teams: item.teams,
              scores: item.scores,
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
var interval = setInterval(function () { fetchFixtures(12, "2023-2024", "bball"); }, 1000);
