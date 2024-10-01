import { config } from './config.js';
import { should } from 'chai';
import { Builder, By, Key, until } from 'selenium-webdriver';
until
should();

// Constants
const check_period = await config.check_period;
const check_limit = await config.check_limit;

const widjet_selector = `[class="widget js-widget animation_slideLTR"]`;
const widjet_close_selector = `[class="widget js-widget animation_slideLTR"] .js-close`;

// Universal functions for tests
class UniversalFunctions {
  // Close big widjet is it appears during tests
  async closeWidjet(driver) {
    try {
      console.log(`Start`);
      await driver.wait(until.elementLocated(By.css(widjet_selector)), 50000);
      // await driver.findElement(By.css(widjet_selector));
      console.log(`Widjet found`);
      await driver.sleep(check_period);
    }
    catch (error) {
      console.log(`Widjet not found`);
      console.log(error);
    }
  }
  // await driver.findElement(By.css(widjet_close_selector)).click();
  // console.log(`Widjet found and closed`);



  // Await for checking something
  async awaitedCheck(driver, fun, arg, error_text) {
    let n = 0;
    let is_condition = await fun(arg);

    while(!is_condition) {
      console.log(n);
      await driver.sleep(check_period);
      is_condition = await fun(arg);
      n++;
      n.should.to.be.below(check_limit / check_period, error_text);
    }
  }

  // Scroll to the element
  async scrollTo(driver, element) {
    const element_Y = await element.getRect().then((value) => {return value.y;});
    const window_Y = await driver.executeScript(`return window.scrollY;`);
    const scroll_distance = element_Y - window_Y - 100;

    await driver.executeScript(`window.scrollBy(0,${scroll_distance});`);
  }

  // Await for clicking something
  async awaitedClick(driver, element) {
    let n = 0;
    let error_text;

    const element_attribute = await element.getAttribute("class");
    async function tryToClick () {
      try {
        await element.click();
        return true;
      }
      catch (err) {
        error_text = `${element_attribute} not clicked: ${err}`;
        return false;
      }
    }

    let is_enabled = await tryToClick();

    while(!is_enabled) {
      await driver.sleep(check_period);
      await this.scrollTo(driver, element);

      is_enabled = await tryToClick();

      n++;
      n.should.to.be.below(check_limit / check_period, error_text);
    }
  }

  // Await for input some text
  async awaitedInput(driver, element, input_text) {
    let n = 0;
    let error_text;

    const element_attribute = await element.getAttribute("class");

    async function tryToInput () {
      try {
        await element.sendKeys(input_text);
        return true;
      }
      catch (err) {
        error_text = `${element_attribute} not inputed: ${err}`;
        return false;
      }
    }

    let is_enabled = await tryToInput();

    while(!is_enabled) {
      await driver.sleep(check_period);
      await this.scrollTo(driver, element);

      is_enabled = await tryToInput();

      n++;
      n.should.to.be.below(check_limit / check_period, error_text);
    }
  }

  // Check is element displayed and active
  async checkIsActive(element) {
    const is_displayed = await element.isDisplayed();

    const is_active = await element.getAttribute("class").then((text) => {
      return text.split(' ').includes('active');
    });

    return is_active && is_displayed
  }

  // Check is element displayed and NOT active
  async checkIsNotActive(element) {
    const is_displayed = await element.isDisplayed();

    const is_active = await element.getAttribute("class").then((text) => {
      return text.split(' ').includes('active');
    });

    return (!is_active) && is_displayed
  }

  // Check is element displayed and include word in class
  async checkIsIncludeClass([element, inp]) {
    const is_displayed = await element.isDisplayed();

    const is_include = await element.getAttribute("class").then((text) => {
      return text.split(' ').includes(inp);
    });

    return is_include && !is_displayed
  }

  // Check is element displayed and NOT include word in class
  async checkIsNotIncludeClass([element, inp]) {
    const is_displayed = await element.isDisplayed();

    const is_include = await element.getAttribute("class").then((text) => {
      return text.split(' ').includes(inp);
    });

    return !is_include && is_displayed
  }
}

export default UniversalFunctions;
