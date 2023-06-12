export const scraperSeasonsLinks = async (browser, url) => {
  let page = await browser.newPage();
  try {
    console.log(`Navigating to ${url}...`);
    await page.goto(url);
    // Wait for the required DOM to be rendered
    await page.waitForSelector(".ResultArchiveContainer");
    console.log("DOM Loaded!");

    let seasonsLinks = await page.evaluate(() => {
      let seasonsLinksDom = document.querySelectorAll(
        ".resultsarchive-filter-wrap > ul > li > a"
      );
      seasonsLinksDom = [...seasonsLinksDom];

      let seasonsLinks = [];
      seasonsLinksDom.forEach((link) => {
        const name = link.getAttribute("data-name");
        if (name === "year") {
          seasonsLinks.push({
            seasons: link.innerText,
            link: link.getAttribute("href"),
          });
        }
      });
      return seasonsLinks;
    });
    return seasonsLinks;
  } catch (error) {
    console.log("Error in scraper - seasons links => ", error);
    setTimeout(async () => {
      await browser.close();
      console.log("Browser closed");
    }, 1000);
  } finally {
    // close current page
    await page.close();
    console.log("Page closed");
  }
};

export const scraperResultLinks = async (browser, url) => {
  let page = await browser.newPage();
  try {
    console.log(`Navigating to ${url}...`);
    await page.goto(url);
    // Wait for the required DOM to be rendered
    await page.waitForSelector(".ResultArchiveContainer");
    console.log("DOM Loaded!");

    let ResultLinks = await page.evaluate(() => {
      let ResultDom = document.querySelectorAll(
        ".resultsarchive-filter-wrap > ul > li > a"
      );
      ResultDom = [...ResultDom];

      let ResultLinks = [];
      ResultDom.forEach((link) => {
        const name = link.getAttribute("data-name");
        if (name === "meetingKey") {
          ResultLinks.push({
            grandPrix: link.innerText,
            link: link.getAttribute("href"),
          });
        }
      });
      return ResultLinks.slice(1);
    });
    return ResultLinks;
  } catch (error) {
    console.log("Error in scraper - result links => ", error);
    setTimeout(async () => {
      await browser.close();
      console.log("Browser closed");
    }, 1000);
  } finally {
    // close current page
    await page.close();
    console.log("Page closed");
  }
};

export const scraperRacesResult = async (browser, url) => {
  let page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  try {
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { timeout: 100000 });
    // Wait for the required DOM to be rendered
    await page.waitForSelector(".ResultArchiveContainer", { timeout: 100000 });
    console.log("DOM Loaded!");
    let racesResult = await page.evaluate(() => {
      const titleRace = document.querySelector(
        ".ResultsArchiveTitle"
      ).innerText;
      const date = document.querySelector(".full-date").innerText;
      let raceResultDom = document.querySelectorAll(
        ".resultsarchive-table > tbody > tr"
      );
      if (raceResultDom.length === 0) {
        return {
          title: titleRace,
          date: date,
          ranking: [],
        };
      }
      raceResultDom = [...raceResultDom];
      raceResultDom = [...raceResultDom];

      const raceResult = [];

      for (let i = 0; i < raceResultDom.length; i++) {
        let row = raceResultDom[i].innerText.split("\t");
        row = {
          position: row[0],
          driver: row[2],
          team: row[3],
          laps: row[4],
          time: row[5],
          points: row[6],
        };
        raceResult.push(row);
      }
      return {
        title: titleRace,
        date: date,
        ranking: raceResult,
      };
    });
    return racesResult;
  } catch (error) {
    console.log("Error in scaper - races result => ", error);
    setTimeout(async () => {
      await browser.close();
      console.log("Browser closed");
    }, 1000);
  } finally {
    // close current page
    await page.close();
    console.log("Page closed");
  }
};

export const scraperDriversResult = async (browser, url) => {
  let page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  try {
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { timeout: 100000 });
    // Wait for the required DOM to be rendered
    await page.waitForSelector(".ResultArchiveContainer", { timeout: 100000 });
    console.log("DOM Loaded!");
    let driverResult = await page.evaluate(() => {
      let driverResultDom = document.querySelectorAll(
        ".resultsarchive-table > tbody > tr"
      );
      driverResultDom = [...driverResultDom];
      const driverResult = [];
      for (let i = 0; i < driverResultDom.length; i++) {
        let row = driverResultDom[i].innerText.split("\t");
        row = {
          driver: row[1],
          nationality: row[2],
          team: row[3],
        };
        driverResult.push(row);
      }
      return driverResult;
    });
    return driverResult;
  } catch (error) {
    console.log("Error in scaper - drivers => ", error);
    setTimeout(async () => {
      await browser.close();
      console.log("Browser closed");
    }, 1000);
  } finally {
    // close current page
    await page.close();
    console.log("Page closed");
  }
};

export const scraperTeamsResult = async (browser, url) => {
  let page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  try {
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { timeout: 100000 });
    // Wait for the required DOM to be rendered
    await page.waitForSelector(".ResultArchiveContainer", { timeout: 100000 });
    console.log("DOM Loaded!");
    let teamResult = await page.evaluate(() => {
      let teamResultDom = document.querySelectorAll(
        ".resultsarchive-table > tbody > tr"
      );
      teamResultDom = [...teamResultDom];
      const teamResult = [];
      for (let i = 0; i < teamResultDom.length; i++) {
        let row = teamResultDom[i].innerText.split("\t");
        row = {
          team: row[1],
        };
        teamResult.push(row);
      }
      return teamResult;
    });
    return teamResult;
  } catch (error) {
    console.log("Error in scaper - teams => ", error);
    setTimeout(async () => {
      await browser.close();
      console.log("Browser closed");
    }, 1000);
  } finally {
    // close current page
    await page.close();
    console.log("Page closed");
  }
};
