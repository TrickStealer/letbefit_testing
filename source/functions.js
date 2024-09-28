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
}

export default UniversalFunctions;
