import { config } from '../config.js';
import { Builder, By, Key } from 'selenium-webdriver';
import { should } from 'chai';
should();


async function algorithm(driver, program_class, diet_name, diet_selector) {
  await driver.get(config.web_site);

  let program_element = await driver.findElement(By.className(program_class));
  program_element.click();

  let diet_element = await driver.findElement(By.css(diet_selector)).findElement(By.xpath('..'));
  diet_element.click();

  await program_element.getAttribute("class").then((text) => {
    text.split(' ').should.include(
      'active',
      `Element "${program_class}" is not active`
    );
  })

  await diet_element.getAttribute("class").then((text) => {
    text.split(' ').should.include(
      'active',
      `Element "${diet_name}" is not active`
    );
  })
}


describe("Select the program", function(){
  it("Снижение веса - Extralight", async function(){
    let driver = await new Builder().forBrowser('chrome').build();

    const program_class = 'program-type__el--seaLight';
    const diet_name = "extralight";
    const diet_selector = `.program-group__el [data-program="${diet_name}"]`;

    try {
      await algorithm(driver, program_class, diet_name, diet_selector);
    }
    finally {
      await driver.quit();
    }
  });

  it("Снижение веса - Light", async function(){
    let driver = await new Builder().forBrowser('chrome').build();

    const program_class = 'program-type__el--seaLight';
    const diet_name = "light";
    const diet_selector = `.program-group__el [data-program="${diet_name}"]`;

    try {
      await algorithm(driver, program_class, diet_name, diet_selector);
    }
    finally {
      await driver.quit();
    }
  });

  it("Снижение веса - Gluten Lacto Free", async function(){
    let driver = await new Builder().forBrowser('chrome').build();

    const program_class = 'program-type__el--seaLight';
    const diet_name = "gluten_free";
    const diet_selector = `.program-group__el [data-program="${diet_name}"]`;

    try {
      await algorithm(driver, program_class, diet_name, diet_selector);
    }
    finally {
      await driver.quit();
    }
  });


  it("Поддержание формы - Normal", async function(){
    let driver = await new Builder().forBrowser('chrome').build();

    const program_class = 'program-type__el--blueLight';
    const diet_name = "normal";
    const diet_selector = `.program-group__el [data-program="${diet_name}"]`;

    try {
      await algorithm(driver, program_class, diet_name, diet_selector);
    }
    finally {
      await driver.quit();
    }
  });

  it("Поддержание формы - Balance Premium", async function(){
    let driver = await new Builder().forBrowser('chrome').build();

    const program_class = 'program-type__el--blueLight';
    const diet_name = "balancepremium";
    const diet_selector = `.program-group__el [data-program="${diet_name}"]`;

    try {
      await algorithm(driver, program_class, diet_name, diet_selector);
    }
    finally {
      await driver.quit();
    }
  });


  it("Набор массы - Strong", async function(){
    let driver = await new Builder().forBrowser('chrome').build();

    const program_class = 'program-type__el--pinkLight';
    const diet_name = "strong";
    const diet_selector = `.program-group__el [data-program="${diet_name}"]`;

    try {
      await algorithm(driver, program_class, diet_name, diet_selector);
    }
    finally {
      await driver.quit();
    }
  });

  it("Набор массы - Strong Premium", async function(){
    let driver = await new Builder().forBrowser('chrome').build();

    const program_class = 'program-type__el--pinkLight';
    const diet_name = "strongpremium";
    const diet_selector = `.program-group__el [data-program="${diet_name}"]`;

    try {
      await algorithm(driver, program_class, diet_name, diet_selector);
    }
    finally {
      await driver.quit();
    }
  });

  it("Набор массы - Super Strong", async function(){
    let driver = await new Builder().forBrowser('chrome').build();

    const program_class = 'program-type__el--pinkLight';
    const diet_name = "superstrong";
    const diet_selector = `.program-group__el [data-program="${diet_name}"]`;

    try {
      await algorithm(driver, program_class, diet_name, diet_selector);
    }
    finally {
      await driver.quit();
    }
  });


  it("Питание без мяса - Vegan", async function(){
    let driver = await new Builder().forBrowser('chrome').build();

    const program_class = 'program-type__el--swampLight';
    const diet_name = "veggi";
    const diet_selector = `.program-group__el [data-program="${diet_name}"]`;

    try {
      await algorithm(driver, program_class, diet_name, diet_selector);
    }
    finally {
      await driver.quit();
    }
  });

  it("Питание без мяса - Fish", async function(){
    let driver = await new Builder().forBrowser('chrome').build();

    const program_class = 'program-type__el--swampLight';
    const diet_name = "fish";
    const diet_selector = `.program-group__el [data-program="${diet_name}"]`;

    try {
      await algorithm(driver, program_class, diet_name, diet_selector);
    }
    finally {
      await driver.quit();
    }
  });

  it("Питание без мяса - Средизем­номорская диета", async function(){
    let driver = await new Builder().forBrowser('chrome').build();

    const program_class = 'program-type__el--swampLight';
    const diet_name = "middlesea";
    const diet_selector = `.program-group__el [data-program="${diet_name}"]`;

    try {
      await algorithm(driver, program_class, diet_name, diet_selector);
    }
    finally {
      await driver.quit();
    }
  });


  it("Очищение организма - Gluten Lacto Free", async function(){
    let driver = await new Builder().forBrowser('chrome').build();

    const program_class = 'program-type__el--orangeLight';
    const diet_name = "gluten_free";
    const diet_selector = `.program-group__el [data-program="${diet_name}"]`;

    try {
      await algorithm(driver, program_class, diet_name, diet_selector);
    }
    finally {
      await driver.quit();
    }
  });


  it("Питание в офис - Everydaily", async function(){
    let driver = await new Builder().forBrowser('chrome').build();

    const program_class = 'program-type__el--violetLight';
    const diet_name = "everydaily";
    const diet_selector = `.program-group__el [data-program="${diet_name}"]`;

    try {
      await algorithm(driver, program_class, diet_name, diet_selector);
    }
    finally {
      await driver.quit();
    }
  });

  it("Питание в офис - Daily", async function(){
    let driver = await new Builder().forBrowser('chrome').build();

    const program_class = 'program-type__el--violetLight';
    const diet_name = "daily";
    const diet_selector = `.program-group__el [data-program="${diet_name}"]`;

    try {
      await algorithm(driver, program_class, diet_name, diet_selector);
    }
    finally {
      await driver.quit();
    }
  });
});

// selectTheProgram('program-type__el--orangeLight')
// selectTheProgram('program-type__el--violetLight')
