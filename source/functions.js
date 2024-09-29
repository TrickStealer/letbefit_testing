import { config } from './config.js';
import { should } from 'chai';
should();

const check_period = await config.check_period;
const check_limit = await config.check_limit;

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
      await driver.sleep(check_period);

      await funs.scrollTo(driver, element);
      is_enabled = await tryToClick();
      n.should.to.be.below(check_limit / check_period, error_text);
    }
  }

  // Check is element active and displayed
  async checkIsActive(element) {
    const is_displayed = await element.isDisplayed();

    const is_active = await element.getAttribute("class").then((text) => {
      return text.split(' ').includes('active');
    });

    return is_active && is_displayed
  }
}

export default UniversalFunctions;
