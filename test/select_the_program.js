import { config } from '../config.js';
import { Builder, By, Key } from 'selenium-webdriver';
import { should } from 'chai';
should();

describe("Select the program", function(){
  it("Снижение веса - Extralight", async function(){
    let driver = await new Builder().forBrowser('chrome').build();

    const class_program = 'program-type__el--seaLight';
    const data_program = "extralightpremium"
    // const selector_diet = '"[class="slider-el-wrap slick-slide slick-current slick-active"]'
    const selector_diet = `.program-group__el [data-program="${data_program}"]`;

    // const check_period = await config.check_period;
    // const check_limit = await config.check_limit;

    try {
      await driver.get(config.web_site);
      await driver.sleep(1000);
      let element = await driver.findElement(By.css(selector_diet)).findElement(By.xpath('..'));

      await element.getAttribute("class").then((text) => {
        text.split(' ').should.include(
          'active',
          `Element "${data_program}" is not active`
        );
      })



      // console.log(element);
      // .then((value) => {
      //   console.log(value.getTagName());
      // })
      // element.click();







      // let element = await driver.findElement(By.className(class_program));
      // element.click();
      //
      // await element.getAttribute("class").then((text) => {
      //   text.split(' ').should.include(
      //     'active',
      //     `Element "${class_program}" is not active`
      //   );
      // })
    }
    finally {
      await driver.quit();
    }
  });
});

// selectTheProgram('program-type__el--seaLight')
// selectTheProgram('program-type__el--blueLight')
// selectTheProgram('program-type__el--pinkLight')
// selectTheProgram('program-type__el--swampLight')
// selectTheProgram('program-type__el--orangeLight')
// selectTheProgram('program-type__el--violetLight')
