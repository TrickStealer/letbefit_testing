import { config } from '../config.js';
import { Builder, By, Key } from 'selenium-webdriver';
import { should } from 'chai';
should();

// === UNIVERSAL CONSTANTS AND FUNCTIONS ===

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


// === TESTS ===

describe("Select the program", function(){
  const browsers = [
    { browser_name: "chrome" },
    { browser_name: "chrome" }
  ];

  const textCases = [
    { program: "weightLoss", diet: "extralight",  title: "Заказать Extralight" },
    { program: "weightLoss", diet: "light",       title: "Заказать Light" },
    { program: "weightLoss", diet: "gluten_free", title: "Заказать Gluten Lacto Free" },

    { program: "saveForm", diet: "normal",          title: "Заказать Normal" },
    { program: "saveForm", diet: "balance",         title: "Заказать Balance" },
    { program: "saveForm", diet: "balancepremium",  title: "Заказать Balance Premium" },

    { program: "weightIncrease", diet: "strong",        title: "Заказать Strong" },
    { program: "weightIncrease", diet: "strongpremium", title: "Заказать Strong Premium" },
    { program: "weightIncrease", diet: "superstrong",   title: "Заказать Super Strong" },

    { program: "meatLoss", diet: "veggi",     title: "Заказать Vegan" },
    { program: "meatLoss", diet: "fish",      title: "Заказать Fish" },
    { program: "meatLoss", diet: "middlesea", title: "Заказать Средизем­номорскую диету" },

    { program: "cleanHeаlth", diet: "gluten_free", title: "Заказать Gluten Lacto Free" },

    { program: "foodOffice", diet: "everydaily",  title: "Заказать Everydaily" },
    { program: "foodOffice", diet: "daily",       title: "Заказать Daily" }
  ];

  browsers.forEach(({ browser_name }) => {
    textCases.forEach(({ program, diet, title }) => {
      it(`${browser_name} - ${program} - ${diet}`, async function(){
        let driver = await new Builder().forBrowser(browser_name).build();

        try {
          await algorithm(driver, program, diet, title);
        }
        finally {
          await driver.quit();
        }
      });
    });
  });



  // it("Снижение веса - Extralight", async function(){
  //   let driver = await new Builder().forBrowser('chrome').build();
  //
  //   const program_name = "weightLoss";
  //   const diet_name = "extralight";
  //   const title_name = "Заказать Extralight";
  //
  //   try {
  //     await algorithm(driver, program_name, diet_name, title_name);
  //   }
  //   finally {
  //     await driver.quit();
  //   }
  // });
  //
  // it("Снижение веса - Light", async function(){
  //   let driver = await new Builder().forBrowser('chrome').build();
  //
  //   const program_name = "weightLoss";
  //   const diet_name = "light";
  //   const title_name = "Заказать Light";
  //
  //   try {
  //     await algorithm(driver, program_name, diet_name, title_name);
  //   }
  //   finally {
  //     await driver.quit();
  //   }
  // });
  //
  // it("Снижение веса - Gluten Lacto Free", async function(){
  //   let driver = await new Builder().forBrowser('chrome').build();
  //
  //   const program_name = "weightLoss";
  //   const diet_name = "gluten_free";
  //   const title_name = "Заказать Gluten Lacto Free";
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
  // it("Поддержание формы - Normal", async function(){
  //   let driver = await new Builder().forBrowser('chrome').build();
  //
  //   const program_name = "saveForm";
  //   const diet_name = "normal";
  //   const title_name = "Заказать Normal";
  //
  //   try {
  //     await algorithm(driver, program_name, diet_name, title_name);
  //   }
  //   finally {
  //     await driver.quit();
  //   }
  // });
  //
  // it("Поддержание формы - Balance Premium", async function(){
  //   let driver = await new Builder().forBrowser('chrome').build();
  //
  //   const program_name = "saveForm";
  //   const diet_name = "balancepremium";
  //   const title_name = "Заказать Balance Premium";
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
  //   const title_name = "Заказать Strong";
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
  //   const title_name = "Заказать Strong Premium";
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
  //   const title_name = "Заказать Super Strong";
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
  //   const title_name = "Заказать Vegan";
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
  //   const title_name = "Заказать Fish";
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
  //   const title_name = "Заказать Средизем­номорскую диету";
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
  //   const title_name = "Заказать Gluten Lacto Free";
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
  //   const title_name = "Заказать Everydaily";
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
  //   const title_name = "Заказать Daily";
  //
  //   try {
  //     await algorithm(driver, program_name, diet_name, title_name);
  //   }
  //   finally {
  //     await driver.quit();
  //   }
  // });
});
