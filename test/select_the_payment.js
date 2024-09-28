import { config } from '../source/config.js';
import { browsers } from '../source/browsers.js';
import UniversalFunctions from '../source/functions.js';

import { Builder, By, Key } from 'selenium-webdriver';
import { should } from 'chai';
should();

// === UNIVERSAL CONSTANTS AND FUNCTIONS ===

const funs = new UniversalFunctions();

// Check is element active and displayed
async function checkIsActive(element) {
  const is_displayed = await element.isDisplayed();

  const is_active = await element.getAttribute("class").then((text) => {
    return text.split(' ').includes('active');
  });

  return is_active && is_displayed
}

// Check is element have goal text
async function checkText([element, goal_text]) {
  return await element.getText().then((text) => {
    return text == goal_text
  })
}

// Await for clicking something
async function awaitedClick(driver, element) {
  let n = 0;

  const element_attribute = await element.getAttribute("class");
  const error_text = `Element ${element_attribute} is not clickable`;

  async function tryToClick () {
    try {
      await element.click();
      return true;
    }
    catch (err) {
      n++;
      return false;
    }
  }

  let is_enabled = await tryToClick();

  while(!is_enabled) {
    await driver.sleep(config.check_period);

    await funs.scrollTo(driver, element);
    is_enabled = await tryToClick();
    n.should.to.be.below(config.check_limit / config.check_period, error_text);
  }
}


// === TESTS ===

describe("Select the program", function() {
  const testCases = [
    // { payment: "6days", no_weekend: "false", have_coupon: "false", recommended: "false" },
    // { payment: "2week", no_weekend: "true", have_coupon: "true", recommended: "true" },
    // { payment: "4week", no_weekend: "false", have_coupon: "true", recommended: "false" },
    //
    // { payment: "8week", no_weekend: "true", have_coupon: "false", recommended: "true" },
    { payment: "12week", no_weekend: "false", have_coupon: "false", recommended: "true" }
  ];

  browsers.forEach(({ browser_name }) => {
    it(`${browser_name}`, async function(){
      let driver = await new Builder().forBrowser(browser_name).build();

      try {
        await driver.get(config.web_site);

        for (let testCase of testCases) {
          const payment = testCase.payment;
          const no_weekend = testCase.no_weekend;
          const have_coupon = testCase.have_coupon;
          const recommended = testCase.recommended;

          const payment_selector = `[data-item="${payment}"] .style-input-element`;
          const no_weekend_selector = `.action-excludeWeek .style-input-element`;
          const have_coupon_selector = `.couponBlock .style-input-element`;
          const recommended_selector = `[data-test="orderCheckFriend"] .style-input-element`;

          let payment_element = await driver.findElement(By.css(payment_selector));
          await awaitedClick(driver, payment_element);

          let no_weekend_element = await driver.findElement(By.css(no_weekend_selector));
          await awaitedClick(driver, no_weekend_element);

          let have_coupon_element = await driver.findElement(By.css(have_coupon_selector));
          await awaitedClick(driver, have_coupon_element);

          let recommended_element = await driver.findElement(By.css(recommended_selector));
          await awaitedClick(driver, recommended_element);




















          // await funs.awaitedCheck(
          //   driver,
          //   checkIsActive,
          //   program_element,
          //   `Element "${program_name}" is not active`
          // );
          //
          // let diet_element = await driver.findElement(By.css(diet_selector)).findElement(By.xpath('..'));
          // await awaitedClick(driver, diet_element);
          //
          // await funs.awaitedCheck(
          //   driver,
          //   checkIsActive,
          //   diet_element,
          //   `Element "${diet_name}" is not active`
          // );

          // let title_element = await driver.findElement(By.className('contract-head-title'));
          // await funs.awaitedCheck(
          //   driver,
          //   checkText,
          //   [title_element, title_name],
          //   `Title is not "${title_name}"`
          // );
        }
      }
      finally {
        await driver.sleep(5000);
        await driver.quit();
      }
    });
  });
});
