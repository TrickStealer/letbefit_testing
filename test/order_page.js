import { config } from '../source/config.js';
import { browsers } from '../source/browsers.js';
import UniversalFunctions from '../source/functions.js';

import { Builder, By, Key } from 'selenium-webdriver';
import { should } from 'chai';
should();

// === UNIVERSAL CONSTANTS AND FUNCTIONS ===

const funs = new UniversalFunctions();


// === TESTS ===

describe("Fill the order form", function() {
  browsers.forEach(({ browser_name }) => {
    it(`${browser_name} - all except program`, async function() {
      let driver = await new Builder().forBrowser(browser_name).build();

      try {
        await driver.get(config.web_site);

        // Check mobile phone
        await driver.findElement(By.className(`type--primary`)).getText().then((value) => {
          value.should.equal("+7(123)456-78-90");
        });

        // Input name
        let name_element = await driver.findElement(By.css(`.input-cont [name="name"]`));
        await funs.awaitedInput(driver, name_element, `Masha`);

        // Input email
        let email_element = await driver.findElement(By.css(`.input-cont [name="email"]`));
        await funs.awaitedInput(driver, email_element, `Masha@masha.ru`);

        // Input adress
        let adress_element = await driver.findElement(By.css(`.input-cont [name="adres"]`));
        await funs.awaitedInput(driver, adress_element, `1 Masha st`);

        // Input order day
        await funs.checkDropdown(
          driver,
          `[data-test="orderDay"] .dropdown-current`,
          `[data-test="orderDay"] .dropdown-menu__el`,
          `[name="first_date"]`,
          `data-value`,
          `value`,
          3
        );

        // Input order timeout
        await funs.checkDropdown(
          driver,
          `[data-test="orderTime"] .dropdown-current`,
          `[data-test="orderTime"] .dropdown-menu__el`,
          `[name="time"]`,
          `data-value`,
          `value`,
          3
        );

        // Select payment by card or cash
        let select_card_element = await driver.findElement(By.css(`[data-pay="ecard"]`));
        let select_cash_element = await driver.findElement(By.css(`[data-pay="cash"]`));
        funs.awaitedClick(driver, select_cash_element);
        funs.checkIsActive(select_cash_element);
        funs.awaitedClick(driver, select_card_element);
        funs.checkIsActive(select_card_element);

        // Checkbox "У меня есть купон"
        funs.selectCheckBox(driver, true, `.action-selected-coupon .style-input-element`);
        let coupon_element = await driver.findElement(By.css(`.action-block-coupon-order`));
        await funs.awaitedCheck(
          driver,
          funs.checkIsNotIncludeClass,
          [coupon_element, "hidden"],
          `Element ".action-block-coupon-order" is hidden but not should be`
        );

        let coupon_text_element = await driver.findElement(By.css(`.js-order-form-coupon`));
        await funs.awaitedInput(driver, coupon_text_element, `1234567890`);
        await driver.sleep(1000);

        funs.selectCheckBox(driver, false, `.action-selected-coupon .style-input-element`);
        await funs.awaitedCheck(
          driver,
          funs.checkIsIncludeClass,
          [coupon_element, "hidden"],
          `Element ".action-block-coupon-order" is not hidden but should be`
        );

        // Checkbox "Добавить комментарий к заказу"
        funs.selectCheckBox(driver, true, `.action-show-textarea .style-input-element`);
        let comment_element = await driver.findElement(By.css(`[data-test="orderCommentValue"]`));
        await funs.awaitedCheck(
          driver,
          funs.checkIsNotIncludeClass,
          [comment_element, "hidden"],
          `Element "[data-test="orderCommentValue"]" is hidden but not should be`
        );

        let comment_text_element = await driver.findElement(By.css(`[name="comment"]`));
        await funs.awaitedInput(driver, comment_text_element, `Something`);
        await driver.sleep(1000);

        funs.selectCheckBox(driver, false, `.action-show-textarea .style-input-element`);
        await funs.awaitedCheck(
          driver,
          funs.checkIsIncludeClass,
          [comment_element, "hidden"],
          `Element "[data-test="orderCommentValue"]" is not hidden but should be`
        );
      }
      finally {
        await driver.sleep(5000);
        await driver.quit();
      }
    });

    // it(`${browser_name} - program`, async function() {
    //   let driver = await new Builder().forBrowser(browser_name).build();
    //
    //   try {
    //     await driver.get(config.web_site);
    //
    //
    //
    //   }
    //   finally {
    //     await driver.sleep(5000);
    //     await driver.quit();
    //   }
    // });
    //
    // it(`${browser_name} - delivery`, async function() {
    //   let driver = await new Builder().forBrowser(browser_name).build();
    //
    //   try {
    //     await driver.get(config.web_site);
    //
    //
    //
    //   }
    //   finally {
    //     await driver.sleep(5000);
    //     await driver.quit();
    //   }
    // });
    //
    // it(`${browser_name} - payment`, async function() {
    //   let driver = await new Builder().forBrowser(browser_name).build();
    //
    //   try {
    //     await driver.get(config.web_site);
    //
    //
    //
    //   }
    //   finally {
    //     await driver.sleep(5000);
    //     await driver.quit();
    //   }
    // });
  });
});
