const { Builder, By, until } = require('selenium-webdriver');
require('dotenv').config();

describe('GitHub Repository Test', () => {
  let driver;

  beforeEach(async () => {
    driver = await new Builder().forBrowser('firefox').build();
  });

  afterEach(async () => {
    console.log('Cleaning up after each test');
    await driver.quit();
  });

  it('Login, Modify HTML Content, and Commit Changes', async () => {
    try {
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
      await driver.wait(until.elementLocated(By.css('.cm-line')), 20000)

      await driver.executeScript(`
        const cmLineElement = document.querySelector('.cm-line');
        if (cmLineElement) {
          cmLineElement.textContent = 'tati: ' + Math.floor(Math.random() * 1000);
        }
      `);
      await driver.wait(until.elementLocated(By.css('button[data-hotkey="Meta+s,Control+s"]')), 10000)
      // Commit changes
      const commitButton = await driver.findElement(By.css('button[data-hotkey="Meta+s,Control+s"]'));
      await commitButton.click();

      await driver.wait(until.elementLocated(By.css('button[data-hotkey="Control+Enter, Control+Enter"]')), 10000)

      const commitButton2 = await driver.findElement(By.css('button[data-hotkey="Control+Enter, Control+Enter"]'));
      await commitButton2.click();

      console.log('Changes committed successfully.');

    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  });
});
