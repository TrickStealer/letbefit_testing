const {Builder, By, Key} = require ("selenium-webdriver");
const assert = require ("assert");


async function checkClickTheProgram(class_name) {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get("https://letbefit.ru/");

    let element = await driver.findElement(By.className(class_name));
    element.click();

    await element.getAttribute("class").then((text) => {
      assert(
        text.split(' ').includes('active'),
        `Element "${class_name}" is not active`
      );
      console.log(`%cTest of clicking "${class_name}" is succesful`, "color: green")
    }).catch(err => {
        console.error(err);
    })

    await driver.sleep(3000);
  }
  finally {
    await driver.quit();
  }
}

checkClickTheProgram('program-type__el--seaLight')
checkClickTheProgram('program-type__el--blueLight')
checkClickTheProgram('program-type__el--pinkLight')
checkClickTheProgram('program-type__el--swampLight')
checkClickTheProgram('program-type__el--orangeLight')
checkClickTheProgram('program-type__el--violetLight')





// await driver.findElement(By.className('program-type__el--seaLight')).click();
// await driver.findElement(By.className('program-type__el--blueLight')).click();
// await driver.findElement(By.className('program-type__el--pinkLight')).click();
// await driver.findElement(By.className('program-type__el--swampLight')).click();
// await driver.findElement(By.className('program-type__el--orangeLight')).click();
// await driver.findElement(By.className('program-type__el--violetLight')).click();
