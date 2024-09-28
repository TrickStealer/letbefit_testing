import { config } from '../config.js';
import { browsers } from '../browsers.js';
import { Builder, By, Key } from 'selenium-webdriver';
import { should } from 'chai';
should();

// === UNIVERSAL CONSTANTS AND FUNCTIONS ===

const check_period = await config.check_period;
const check_limit = await config.check_limit;
const css_text = '.program-main-wrap .type--w700';

// Scroll to the element
async function scrollTo(driver, element_Y) {
  const window_Y = await driver.executeScript(`return window.scrollY;`);
  const scroll_distance = element_Y - window_Y - 100;

  await driver.executeScript(`window.scrollBy(0,${scroll_distance});`);
}

// Await for checking something
async function awaitedCheck(driver, fun, arg, error_text) {
  let n = 0;
  let is_condition = await fun(arg);

  while(!is_condition) {
    await driver.sleep(check_period);
    is_condition = await fun(arg);
    n++;
    n.should.to.be.below(check_limit / check_period, error_text);
  }
}

// Check is element visible
async function checkIsVisible([driver, element_Y]) {
  const params = await driver.executeScript(`return { h: window.innerHeight, y: window.scrollY };`);
  return (params.y < element_Y) && (element_Y < params.y + params.h);
}

// === TESTS ===

describe("Scrolling to form", function(){
  browsers.forEach(({ browser_name }) => {

    it(`${browser_name} - By click the button 'Выбрать программу'`, async function(){
      let driver = await new Builder().forBrowser(browser_name).build();

      const css_button = '.slider-main .slick-current .md__hide .action-select-topbar-program';

      try {
        await driver.get(config.web_site);

        const text_Y = await driver.findElement(By.css(css_text)).getRect().then((value) => {return value.y;});
        await driver.findElement(By.css(css_button)).click();
        await driver.executeScript(`window.scrollBy(0,-100);`);

        await awaitedCheck(
          driver,
          checkIsVisible,
          [driver, text_Y],
          `Page not scrolled to the goal element`
        );

      }
      finally {
        await driver.quit();
      }
    });

    it(`${browser_name} - By simple scrolling`, async function(){
      let driver = await new Builder().forBrowser(browser_name).build();

      try {
        await driver.get(config.web_site);

        const text_Y = await driver.findElement(By.css(css_text)).getRect().then((value) => {return value.y;});
        await scrollTo(driver, text_Y);

        await awaitedCheck(
          driver,
          checkIsVisible,
          [driver, text_Y],
          `Page not scrolled to the goal element`
        );
      }
      finally {
        await driver.quit();
      }
    });
  });
});
