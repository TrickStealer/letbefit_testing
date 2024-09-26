import { config } from '../config.js';
import { Builder, By, Key } from 'selenium-webdriver';
import { should } from 'chai';
should();

describe("Scrolling to form", function(){
  it("By click the button 'Выбрать программу'", async function(){
    let driver = await new Builder().forBrowser('chrome').build();

    const css_button = '.slider-main .slick-current .md__hide .action-select-topbar-program';
    const css_text = '.program-main-wrap .type--w700';

    const scroll_check_period = await config.check_period;
    const scroll_check_limit = await config.check_limit;

    try {
      await driver.get(config.web_site);
      await driver.findElement(By.css(css_button)).click();

      const text_Y = await driver.findElement(By.css(css_text)).getRect().then((value) => {return value.y;});

      let window_H_Y = await driver.executeScript(`return [window.innerHeight, window.scrollY];`);

      let is_text_visible = (window_H_Y[1] < text_Y) && (text_Y < window_H_Y[1] + window_H_Y[0]);

      let n = 0;

      while (!is_text_visible) {
        await driver.sleep(scroll_check_period);

        window_H_Y = await driver.executeScript(`return [window.innerHeight, window.scrollY];`);

        is_text_visible = (window_H_Y[1] < text_Y) && (text_Y < window_H_Y[1] + window_H_Y[0]);

        n++;
        n.should.to.be.below(scroll_check_limit / scroll_check_period,
          `Page not scrolled more than ${scroll_check_limit / 1000} seconds`);
      }
    }
    finally {
      // await driver.sleep(5000);
      await driver.quit();
    }
  });
});
