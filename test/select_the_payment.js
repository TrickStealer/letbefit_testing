import { config } from '../source/config.js';
import { browsers } from '../source/browsers.js';
import UniversalFunctions from '../source/functions.js';

import { Builder, By, Key } from 'selenium-webdriver';
import { should } from 'chai';
should();

// === UNIVERSAL CONSTANTS AND FUNCTIONS ===

const funs = new UniversalFunctions();

// Check is element active and displayed
async function checkIsSelectedFlex([should_selected, element]) {
  const css_display = await element.getCssValue('display')
  const is_selected = (css_display == 'flex');
  return (is_selected == should_selected);
}

async function selectCheckBoxs(driver, should_selected, selector) {
  let element = await driver.findElement(By.css(selector));

  if (! (await checkIsSelectedFlex([should_selected, element]))) {
    await funs.awaitedClick(driver, element);
  }

  await funs.awaitedCheck(
    driver,
    checkIsSelectedFlex,
    [should_selected, element],
    `Element ${selector} not selected`
  );
}


// === TESTS ===

describe("Select the program", function() {
  const payment_radio = [
    "6days",
    "2week",
    "4week",
    "8week",
    "12week"
  ]

  const testCases = [
    { payment: payment_radio[0], no_weekend: false, have_coupon: false, recommended: false },
    { payment: payment_radio[1], no_weekend: true, have_coupon: true, recommended: true },
    { payment: payment_radio[2], no_weekend: false, have_coupon: true, recommended: false },

    { payment: payment_radio[3], no_weekend: true, have_coupon: false, recommended: true },
    { payment: payment_radio[4], no_weekend: true, have_coupon: false, recommended: false }
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

          console.log(`${payment} ${no_weekend} ${have_coupon} ${recommended}`);

          const payment_selector = `[data-item="${payment}"] .style-input-element`;
          const no_weekend_selector = `.action-excludeWeek .style-input-element`;
          const have_coupon_selector = `.couponBlock .style-input-element`;
          const recommended_selector = `[data-test="orderCheckFriend"] .style-input-element`;

          let payment_element = await driver.findElement(By.css(payment_selector));
          await funs.awaitedClick(driver, payment_element);

          await selectCheckBoxs(driver, no_weekend, no_weekend_selector);
          await selectCheckBoxs(driver, have_coupon, have_coupon_selector);
          await selectCheckBoxs(driver, recommended, recommended_selector);
          await driver.sleep(5000);
        }
      }
      finally {

        await driver.quit();
      }
    });
  });
});
