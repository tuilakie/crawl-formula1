import {
  scraperSeasonsLinks,
  scraperResultLinks,
  scraperRacesResult,
  scraperDriversResult,
  scraperTeamsResult,
} from "./scraper.js";
import fs from "fs";

const scrapeController = async (browserInstance) => {
  try {
    let browser = await browserInstance;
    const seasons = await scraperSeasonsLinks(
      browser,
      "https://www.formula1.com/en/results.html/2023/races.html"
    );

    const drivers = seasons.map((item) => {
      return {
        season: item.seasons,
        link: item.link.replace("races", "drivers"),
      };
    });

    const teams = seasons.map((item) => {
      return {
        season: item.seasons,
        link: item.link.replace("races", "team"),
      };
    });

    const driversResult = await Promise.all(
      drivers.map(async (item) => {
        const driversResult = await scraperDriversResult(
          browser,
          "https://www.formula1.com" + item.link
        );
        return {
          season: item.season,
          driversResult: driversResult,
        };
      })
    );
    // append data to json file with fs
    fs.appendFile(
      "./data/driversResult.json",
      JSON.stringify(driversResult),
      (err) => {
        if (err) throw err;
        console.log("Data written to file");
      }
    );
    console.log("write driversResult.json done");

    const teamResult = await Promise.all(
      teams.map(async (item) => {
        const teamResult = await scraperTeamsResult(
          browser,
          "https://www.formula1.com" + item.link
        );
        return {
          season: item.seasons,
          teamResult: teamResult,
        };
      })
    );

    // append data to json file with fs
    fs.appendFile(
      "./data/teamsResult.json",
      JSON.stringify(teamResult),
      (err) => {
        if (err) throw err;
        console.log("Data written to file");
      }
    );
    console.log("write teamsResult.json done");

    for (let i = 0; i < seasons.length + 10; i = i + 10) {
      const racesLinks = await Promise.all(
        seasons.slice(i, i + 10).map(async (season) => {
          const racesResultLinks = await scraperResultLinks(
            browser,
            "https://www.formula1.com" + season.link
          );
          return racesResultLinks.map((item) => {
            return {
              season: season.seasons,
              grandPrix: item.grandPrix,
              link: item.link,
            };
          });
        })
      );

      const racesLinksFlatten = racesLinks.flat();
      const racesResult = await Promise.all(
        racesLinksFlatten.map(async (item) => {
          const racesResult = await scraperRacesResult(
            browser,
            "https://www.formula1.com" + item.link
          );
          return racesResult;
        })
      );
      // append data to json file with fs
      fs.appendFile(
        "./data/racesResult.json",
        JSON.stringify(racesResult),
        (err) => {
          if (err) throw err;
          console.log("Data written to file");
        }
      );
    }
    console.log("write racesResult.json done");

    // close the browser
    await browser.close();
    console.log("All done, close the browser");
  } catch (error) {
    console.log("Could not resolve the browser instance => ", error);
  }
};

export default scrapeController;
