const {Builder, By, Key} = require ("selenium-webdriver");
const assert = require ("assert");


async function selectTheProgram(class_name) {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get("https://letbefit.ru/");

    let element = await driver.findElement(By.className(class_name));
    element.click();

    await element.getAttribute("class").then((text) => {
      assert(
        text.split(' ').includes('active'),
        `Test "selectTheProgram": element "${class_name}" is not active`
      );
      console.log(`Test "selectTheProgram": element "${class_name}" is active`)
    }).catch(err => {
        console.error(err);
    })

    await driver.sleep(3000);
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
