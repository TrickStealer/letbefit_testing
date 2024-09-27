import { config } from '../config.js';
import { Builder, By, Key } from 'selenium-webdriver';
import { should } from 'chai';
should();

// === Universal constants and functions ===

const check_period = config.check_period;
const check_limit = config.check_limit;

// Check is element active and displayed
async function checkIsActive(element) {
  const is_displayed = await element.isDisplayed();

  const is_active = await element.getAttribute("class").then((text) => {
    return text.split(' ').includes('active');
  });

  return is_active && is_displayed
}

// Check is element have goal text
async function checkText([element, goal_text]) {
  return await element.getText().then((text) => {
    return text == goal_text
  })
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

// Main algorithm to select the program, diet and check result
async function algorithm(driver, program_name, diet_name, title_name) {
  await driver.get(config.web_site);

  const program_selector = `.js-tick-cont [data-programtype="${program_name}"]`;
  const diet_selector = `[data-programtype="${program_name}"] [data-program="${diet_name}"]`;

  let program_element = await driver.findElement(By.css(program_selector));
  program_element.click();

  await awaitedCheck(
    driver,
    checkIsActive,
    program_element,
    `Element "${program_name}" is not active`
  );

  let diet_element = await driver.findElement(By.css(diet_selector)).findElement(By.xpath('..'));
  diet_element.click();

  await awaitedCheck(
    driver,
    checkIsActive,
    diet_element,
    `Element "${diet_name}" is not active`
  );

  let title_element = await driver.findElement(By.className('contract-head-title'));

  await awaitedCheck(
    driver,
    checkText,
    [title_element, title_name],
    `Title is not "${title_name}"`
  );
}


// === Tests ===

describe("Select the program", function(){
  it("Снижение веса - Extralight", async function(){
    let driver = await new Builder().forBrowser('chrome').build();

    const program_name = "weightLoss";
    const diet_name = "extralight";
    const title_name = "Заказать Extralight"

    try {
      await algorithm(driver, program_name, diet_name, title_name);
    }
    finally {
      await driver.quit();
    }
  });

  it("Снижение веса - Light", async function(){
    let driver = await new Builder().forBrowser('chrome').build();

    const program_name = "weightLoss";
    const diet_name = "light";
    const title_name = "Заказать Light"

    try {
      await algorithm(driver, program_name, diet_name, title_name);
    }
    finally {
      await driver.quit();
    }
  });

  // it("Снижение веса - Gluten Lacto Free", async function(){
  //   let driver = await new Builder().forBrowser('chrome').build();
  //
  //   const program_name = "weightLoss";
  //   const diet_name = "gluten_free";
  //
  //   try {
  //     await algorithm(driver, program_name, diet_name, title_name);
  //   }
  //   finally {
  //     await driver.quit();
  //   }
  // });


  it("Поддержание формы - Normal", async function(){
    let driver = await new Builder().forBrowser('chrome').build();

    const program_name = "saveForm";
    const diet_name = "normal";
    const title_name = "Заказать Normal"

    try {
      await algorithm(driver, program_name, diet_name, title_name);
    }
    finally {
      // await driver.sleep(5000);
      await driver.quit();
    }
  });

  // it("Поддержание формы - Balance Premium", async function(){
  //   let driver = await new Builder().forBrowser('chrome').build();
  //
  //   const program_name = "saveForm";
  //   const diet_name = "balancepremium";
  //
  //   try {
  //     await algorithm(driver, program_name, diet_name, title_name);
  //   }
  //   finally {
  //     await driver.quit();
  //   }
  // });
  //
  //
  // it("Набор массы - Strong", async function(){
  //   let driver = await new Builder().forBrowser('chrome').build();
  //
  //   const program_name = "weightIncrease";
  //   const diet_name = "strong";
  //
  //   try {
  //     await algorithm(driver, program_name, diet_name, title_name);
  //   }
  //   finally {
  //     await driver.quit();
  //   }
  // });
  //
  // it("Набор массы - Strong Premium", async function(){
  //   let driver = await new Builder().forBrowser('chrome').build();
  //
  //   const program_name = "weightIncrease";
  //   const diet_name = "strongpremium";
  //
  //   try {
  //     await algorithm(driver, program_name, diet_name, title_name);
  //   }
  //   finally {
  //     await driver.quit();
  //   }
  // });
  //
  // it("Набор массы - Super Strong", async function(){
  //   let driver = await new Builder().forBrowser('chrome').build();
  //
  //   const program_name = "weightIncrease";
  //   const diet_name = "superstrong";
  //
  //   try {
  //     await algorithm(driver, program_name, diet_name, title_name);
  //   }
  //   finally {
  //     await driver.quit();
  //   }
  // });
  //
  //
  // it("Питание без мяса - Vegan", async function(){
  //   let driver = await new Builder().forBrowser('chrome').build();
  //
  //   const program_name = "meatLoss";
  //   const diet_name = "veggi";
  //
  //   try {
  //     await algorithm(driver, program_name, diet_name, title_name);
  //   }
  //   finally {
  //     await driver.quit();
  //   }
  // });
  //
  // it("Питание без мяса - Fish", async function(){
  //   let driver = await new Builder().forBrowser('chrome').build();
  //
  //   const program_name = "meatLoss";
  //   const diet_name = "fish";
  //
  //   try {
  //     await algorithm(driver, program_name, diet_name, title_name);
  //   }
  //   finally {
  //     await driver.quit();
  //   }
  // });
  //
  // it("Питание без мяса - Средизем­номорская диета", async function(){
  //   let driver = await new Builder().forBrowser('chrome').build();
  //
  //   const program_name = "meatLoss";
  //   const diet_name = "middlesea";
  //
  //   try {
  //     await algorithm(driver, program_name, diet_name, title_name);
  //   }
  //   finally {
  //     await driver.quit();
  //   }
  // });
  //
  //
  // it("Очищение организма - Gluten Lacto Free", async function(){
  //   let driver = await new Builder().forBrowser('chrome').build();
  //
  //   const program_name = "cleanHeаlth";
  //   const diet_name = "gluten_free";
  //
  //   try {
  //     await algorithm(driver, program_name, diet_name, title_name);
  //   }
  //   finally {
  //     await driver.quit();
  //   }
  // });
  //
  //
  // it("Питание в офис - Everydaily", async function(){
  //   let driver = await new Builder().forBrowser('chrome').build();
  //
  //   const program_name = "foodOffice";
  //   const diet_name = "everydaily";
  //
  //   try {
  //     await algorithm(driver, program_name, diet_name, title_name);
  //   }
  //   finally {
  //     await driver.quit();
  //   }
  // });
  //
  // it("Питание в офис - Daily", async function(){
  //   let driver = await new Builder().forBrowser('chrome').build();
  //
  //   const program_name = "foodOffice";
  //   const diet_name = "daily";
  //
  //   try {
  //     await algorithm(driver, program_name, diet_name, title_name);
  //   }
  //   finally {
  //     await driver.quit();
  //   }
  // });
});
