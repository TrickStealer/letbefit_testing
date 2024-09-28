import { config } from '../source/config.js';
import { browsers } from '../source/browsers.js';
import UniversalFunctions from '../source/functions.js';

import { Builder, By, Key } from 'selenium-webdriver';

// === UNIVERSAL CONSTANTS AND FUNCTIONS ===

const funs = new UniversalFunctions();
const css_text = '.program-main-wrap .type--w700';

// Check is element visible
async function checkIsVisible([driver, element]) {
  const element_Y = await element.getRect().then((value) => {return value.y;});
  const params = await driver.executeScript(`return { h: window.innerHeight, y: window.scrollY };`);

  const is_window = (params.y < element_Y) && (element_Y < params.y + params.h);
  const is_displayed = await element.isDisplayed();

  return is_window && is_displayed
}

// === TESTS ===

describe("Scrolling to the form", function(){
  browsers.forEach(({ browser_name }) => {

    it(`${browser_name} - By click the button 'Выбрать программу'`, async function(){
      let driver = await new Builder().forBrowser(browser_name).build();

      const css_button = '.slider-main .slick-current .md__hide .action-select-topbar-program';

      try {
        await driver.get(config.web_site);

        let text_element = await driver.findElement(By.css(css_text));

        await driver.findElement(By.css(css_button)).click();
        await driver.executeScript(`window.scrollBy(0,-100);`);

        await funs.awaitedCheck(
          driver,
          checkIsVisible,
          [driver, text_element],
          `Page not scrolled to the goal element`
        );

      }
      finally {
        await driver.sleep(3000);
        await driver.quit();
      }
    });

    it(`${browser_name} - By simple scrolling`, async function(){
      let driver = await new Builder().forBrowser(browser_name).build();

      try {
        await driver.get(config.web_site);

        let text_element = await driver.findElement(By.css(css_text));

        const text_Y = await text_element.getRect().then((value) => {return value.y;});
        await funs.scrollTo(driver, text_element);

        await funs.awaitedCheck(
          driver,
          checkIsVisible,
          [driver, text_element],
          `Page not scrolled to the goal element`
        );
      }
      finally {
        await driver.sleep(3000);
        await driver.quit();
      }
    });
  });
});
