// Selenium Script (selenium-script.js)
const { Builder, By, until } = require('selenium-webdriver');
const schedule = require('node-schedule');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

// Function to run the Selenium script
const runSeleniumScript = async () => {
  let driver;

  try {
    driver = await new Builder().forBrowser('firefox').build();

    // Navigate to GitHub login page
    await driver.get('https://github.com/login');

    // Fill in login details
    const usernameInput = await driver.findElement(By.id('login_field'));
    await usernameInput.sendKeys(process.env.user); // Replace with your GitHub username

    const passwordInput = await driver.findElement(By.id('password'));
    await passwordInput.sendKeys(process.env.password); // Replace with your GitHub password

    const signInButton = await driver.findElement(By.name('commit'));
    await signInButton.click();

    const url = 'https://github.com/yeabtsegataye/git-one/edit/master/index.html';
    await driver.get(url);

    // await new Promise(resolve => setTimeout(resolve, 10000));
    await driver.wait(until.elementLocated(By.css('.cm-line')), 20000);

    await driver.executeScript(`
      const cmLineElement = document.querySelector('.cm-line');
      if (cmLineElement) {
        cmLineElement.textContent = 'tati: ' + Math.floor(Math.random() * 1000);
      }
    `);

    await driver.wait(until.elementLocated(By.css('button[data-hotkey="Meta+s,Control+s"]')), 10000);

    // Commit changes
    const commitButton = await driver.findElement(By.css('button[data-hotkey="Meta+s,Control+s"]'));
    await commitButton.click();

    await driver.wait(until.elementLocated(By.css('button[data-hotkey="Control+Enter, Control+Enter"]')), 10000);

    const commitButton2 = await driver.findElement(By.css('button[data-hotkey="Control+Enter, Control+Enter"]'));
    await commitButton2.click();

    console.log('Changes committed successfully.');
  } catch (error) {
    console.error('Error in Selenium script:', error);
    throw error;
  } finally {
    // Close the WebDriver
    if (driver) {
      await driver.quit();
    }
  }
};

// Schedule the script to run every 4 hours
// min ,hr, day, month, day_Of_Week
//*/1 * * * *  ..... this is for 1 min
const job = schedule.scheduleJob('0 */4 * * *', async () => {
  console.log('Running Selenium script...');
  await runSeleniumScript();
});

// Express Server (server.js)


app.listen(4000, () => {
  console.log('Server listening for requests on port 4000');
});
