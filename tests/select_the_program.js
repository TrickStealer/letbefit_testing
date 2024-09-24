import { Builder, By, Key } from 'selenium-webdriver';
import { should } from 'chai';
should();

async function selectTheProgram(class_name) {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get("https://letbefit.ru/");

    let element = await driver.findElement(By.className(class_name));
    // element.click();

    await element.getAttribute("class").then((text) => {
      text.split(' ').should.include(
        'active',
        `Test "selectTheProgram": element "${class_name}" is not active`
      );
      console.log(`Test "selectTheProgram": element "${class_name}" is active`);
    })
  }
  catch(message) {
    console.log(message);
  }
  finally {
    await driver.quit();
  }
}

selectTheProgram('program-type__el--seaLight')
selectTheProgram('program-type__el--blueLight')
selectTheProgram('program-type__el--pinkLight')
selectTheProgram('program-type__el--swampLight')
selectTheProgram('program-type__el--orangeLight')
selectTheProgram('program-type__el--violetLight')
