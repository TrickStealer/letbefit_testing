import { config } from '../source/config.js';
import { browsers } from '../source/browsers.js';
import UniversalFunctions from '../source/functions.js';

import { Builder, By, Key } from 'selenium-webdriver';
import { should } from 'chai';
should();

// === UNIVERSAL CONSTANTS AND FUNCTIONS ===

const funs = new UniversalFunctions();

// === TESTS ===

describe("Select the program", function() {
  browsers.forEach(({ browser_name }) => {
    it(`${browser_name} - radio buttons and selections`, async function() {
      let driver = await new Builder().forBrowser(browser_name).build();

      // Test data
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

          // Select payment method
          let payment_element = await driver.findElement(By.css(payment_selector));
          await funs.awaitedClick(driver, payment_element);

          for (let element_name of payment_radio) {
            const element = await driver.findElement(By.css(`[data-item="${element_name}"]`));

            if (element_name == payment) {
              await funs.awaitedCheck(
                driver,
                funs.checkIsActive,
                element,
                `Element ${element_name} not selected but should be`
              );
            }
            else {
              await funs.awaitedCheck(
                driver,
                funs.checkIsNotActive,
                element,
                `Element ${element_name} is selected but not should be`
              );
            }
          }

          // Select exclude weekend or not
          await funs.selectCheckBox(driver, no_weekend, no_weekend_selector);

          // Select have coupon or not
          await funs.selectCheckBox(driver, have_coupon, have_coupon_selector);

          let coupon_block_element = await driver.findElement(By.className(`js-coupon-block`));
          let nocoupon_block_element = await driver.findElement(By.className(`js-nocoupon-block`));
          if (have_coupon) {
            await funs.awaitedCheck(
              driver,
              funs.checkIsIncludeClass,
              [nocoupon_block_element, "hidden"],
              `Element "js-nocoupon-block" is not hidden but should be`
            );
            await funs.awaitedCheck(
              driver,
              funs.checkIsNotIncludeClass,
              [coupon_block_element, "hidden"],
              `Element "js-coupon-block" is hidden but not should be`
            );

          }
          else {
            await funs.awaitedCheck(
              driver,
              funs.checkIsIncludeClass,
              [coupon_block_element, "hidden"],
              `Element "js-coupon-block" is not hidden but should be`
            );
            await funs.awaitedCheck(
              driver,
              funs.checkIsNotIncludeClass,
              [nocoupon_block_element, "hidden"],
              `Element "js-nocoupon-block" is hidden but not should be`
            );
          }

          // Select recommended by friend or not
          await funs.selectCheckBox(driver, recommended, recommended_selector);

          let recommendFriend_element = await driver.findElement(By.css(`.contract-content > [data-item="recommendFriend"]`));
          if (recommended) {
            await funs.awaitedCheck(
              driver,
              funs.checkIsNotIncludeClass,
              [recommendFriend_element, "hidden"],
              `Element "recommendFriend" is hidden but not should be`
            );
          }
          else {
            await funs.awaitedCheck(
              driver,
              funs.checkIsIncludeClass,
              [recommendFriend_element, "hidden"],
              `Element "recommendFriend" is not hidden but should be`
            );
          }
        }
      }
      finally {
        await driver.quit();
      }
    });

    it(`${browser_name} - text inputs`, async function() {
      let driver = await new Builder().forBrowser(browser_name).build();

      try {
        await driver.get(config.web_site);

        const have_coupon_selector = `.couponBlock .style-input-element`;
        const recommended_selector = `[data-test="orderCheckFriend"] .style-input-element`;

        // Input phone without coupon
        let phone_element = await driver.findElement(By.css(`.checkPhoneBlockWithoutCoupon .input-mask--phone`));
        await funs.awaitedInput(driver, phone_element, `1234567890`);

        // Select checkbox "У меня есть купон"
        await funs.selectCheckBox(driver, true, have_coupon_selector);

        // Input phone and coupon
        let coupon_element = await driver.findElement(By.css(`[name="coupon"]`));
        await funs.awaitedInput(driver, coupon_element, `1234567890`);

        phone_element = await driver.findElement(By.css(`.checkPhoneBlock .input-mask--phone`));
        await funs.awaitedInput(driver, phone_element, `1234567890`);

        // Select checkbox "Befit мне рекомендовал друг"
        await funs.selectCheckBox(driver, true, recommended_selector);

        // Input friend's phone
        let recommended_phone_element = await driver.findElement(By.css(`.input-cont [name="phone_friend"]`));
        await funs.awaitedInput(driver, recommended_phone_element, `1234567890`);
      }
      finally {
        await driver.quit();
      }
    });
  });
});
