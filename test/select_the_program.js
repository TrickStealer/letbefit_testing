import { config } from '../config.js';
import { browsers } from '../browsers.js';
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

describe("Select the program", function() {
  const textCases = [
    { program: "weightLoss", diet: "extralight",  title: "Заказать Extralight" }
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
      const browser_name = "chrome"

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
});
