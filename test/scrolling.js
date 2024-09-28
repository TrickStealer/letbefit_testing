import { config } from '../config.js';
import { browsers } from '../browsers.js';
import { Builder, By, Key } from 'selenium-webdriver';
import { should } from 'chai';
should();

// === UNIVERSAL CONSTANTS AND FUNCTIONS ===

const scroll_check_period = await config.check_period;
const scroll_check_limit = await config.check_limit;

// Check is element visible
async function checkIsVisible(driver, element_Y) {
  let n = 0;
  let window_H_Y = await driver.executeScript(`return [window.innerHeight, window.scrollY];`);
  let is_element_visible = (window_H_Y[1] < element_Y) && (element_Y < window_H_Y[1] + window_H_Y[0]);

  while (!is_element_visible) {
    await driver.sleep(scroll_check_period);

    window_H_Y = await driver.executeScript(`return [window.innerHeight, window.scrollY];`);
    is_element_visible = (window_H_Y[1] < element_Y) && (element_Y < window_H_Y[1] + window_H_Y[0]);

    n++;
    n.should.to.be.below(scroll_check_limit / scroll_check_period,
      `Page not scrolled to goal element more than ${scroll_check_limit / 1000} seconds`);
  }
}

// === TESTS ===

describe("Scrolling to form", function(){
  browsers.forEach(({ browser_name }) => {

    it(`${browser_name} - By click the button 'Выбрать программу'`, async function(){
      let driver = await new Builder().forBrowser(browser_name).build();

      const css_button = '.slider-main .slick-current .md__hide .action-select-topbar-program';
      const css_text = '.program-main-wrap .type--w700';

      try {
        await driver.get(config.web_site);

        const text_Y = await driver.findElement(By.css(css_text)).getRect().then((value) => {return value.y;});

        await driver.findElement(By.css(css_button)).click();

        await checkIsVisible(driver, text_Y);
      }
      finally {
        await driver.sleep(5000);
        await driver.quit();
      }
    });

    it(`${browser_name} - By simple scrolling`, async function(){
      let driver = await new Builder().forBrowser(browser_name).build();

      const css_text = '.program-main-wrap .type--w700';

      try {
        await driver.get(config.web_site);

        const text_Y = await driver.findElement(By.css(css_text)).getRect().then((value) => {return value.y;});

        await driver.executeScript(`window.scrollBy(0,${text_Y - 60})`);

        await checkIsVisible(driver, text_Y);
      }
      finally {
        await driver.sleep(5000);
        await driver.quit();
      }
    });
  });
});
