import { Builder, By, Key } from 'selenium-webdriver';
import { should } from 'chai';
should();






describe("Select the program", function(){
  it("seaLight", async function(){
    const class_name = 'program-type__el--seaLigt'

    let driver = await new Builder().forBrowser('chrome').build();

    try {
      await driver.get("https://letbefit.ru/");

      let element = await driver.findElement(By.className(class_name));
      element.click();

      await element.getAttribute("class").then((text) => {
        text.split(' ').should.include(
          'active',
          `Element "${class_name}" is not active`
        );
      })
    }
    finally {
      await driver.quit();
    }
  });

  it("violetLight", async function(){
    const class_name = 'program-type__el--violetLight'

    let driver = await new Builder().forBrowser('chrome').build();

    try {
      await driver.get("https://letbefit.ru/");

      let element = await driver.findElement(By.className(class_name));
      // element.click();

      await element.getAttribute("class").then((text) => {
        text.split(' ').should.include(
          'active',
          `Element "${class_name}" is not active`
        );
      })
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
