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
  // Await for checking something
  async awaitedCheck(driver, fun, arg, error_text) {
    let n = 0;
    let is_condition = await fun(arg);

    while(!is_condition) {
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

  // Check is element selected as flex container
  async checkIsSelectedFlex([should_selected, element]) {
    const css_display = await element.getCssValue('display');
    const is_selected = (css_display == 'flex');
    return (is_selected == should_selected);
  }

  // Select checkbox and check it
  async selectCheckBox(driver, should_selected, selector) {
    let element = await driver.findElement(By.css(selector));

    if (! (await this.checkIsSelectedFlex([should_selected, element]))) {
      await this.awaitedClick(driver, element);
    }

    await funs.awaitedCheck(
      driver,
      this.checkIsSelectedFlex,
      [should_selected, element],
      `Element ${selector} not selected`
    );
  }

  // Check dropdown element
  async checkDropdown(driver,
                      css_to_click,
                      css_from_list,
                      css_result,
                      attr_fom_list,
                      attr_result,
                      num_fom_list) {

    let to_click_element = await driver.findElement(By.css(css_to_click));
    await this.awaitedClick(driver, to_click_element);

    let from_list_element = await driver.findElements(By.css(css_from_list))
      .then((values) => {
        return values[num_fom_list];
      });

    const from_list_text = await from_list_element.getDomAttribute(attr_fom_list);
    await this.awaitedClick(driver, from_list_element);

    const result_text = await driver.findElement(By.css(css_result)).getDomAttribute(attr_result);
    result_text.should.equal(from_list_text);
  }
}

export default UniversalFunctions;
