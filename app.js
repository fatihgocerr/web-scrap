const puppeteer = require('puppeteer');



const urlList = ['https://www.haremaltin.com/', 'https://canlidoviz.com/doviz-kurlari/kapali-carsi'];

const getAllCurrencyData = async () => {
 const allData = [];

 for (const url of urlList) {
  try {
   const browser = await puppeteer.launch();
   const page = await browser.newPage();

   await page.goto(url);
   await page.waitForSelector('tbody tr');

   const data = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('tbody tr'));
    return nodes.map(node => node.textContent.trim());
   });

   if (url === 'https://www.haremaltin.com/') {
    const extractCurrencyValue = (currencyData) => {
     const matches = currencyData.match(/\d+,\d+/g);
     if (matches && matches.length > 0) {
      return matches;
     }
     return null;
    };

    let haremCurrencyData = [];
    const usdCurrencyData = data.find((currency) => currency.includes('USD/TL'));
    const eurCurrencyData = data.find((currency) => currency.includes('EUR/TL'));
    const usdValue = extractCurrencyValue(usdCurrencyData);
    const eurValue = extractCurrencyValue(eurCurrencyData);
    haremCurrencyData.push({
     usd: usdValue,
     eur: eurValue
    });

    allData.push({ 'harem': haremCurrencyData });
   }
   else if (url === 'https://canlidoviz.com/doviz-kurlari/kapali-carsi') {
    const extractCurrencyValues = (currencyData) => {
     const lines = currencyData.split('\n').map(line => line.trim()).filter(line => line !== '');
     return lines.slice(3, 5);
    };

    let kapaliCurrencyData = [];
    const usdCurrencyData = data.find((currency) => currency.includes('USD'));
    const eurCurrencyData = data.find((currency) => currency.includes('EUR'));
    const usdValue = extractCurrencyValues(usdCurrencyData);
    const eurValue = extractCurrencyValues(eurCurrencyData);
    kapaliCurrencyData.push({
     usd: usdValue,
     eur: eurValue
    });

    allData.push({ 'grandBazaar': kapaliCurrencyData });
   }

   await browser.close();
  } catch (error) {
   console.log('err', error);
  }
 }

 return allData;
};

getAllCurrencyData().then((data) => {
 console.dir(data, { depth: null }) // console.dir yöntemi nesneleri ayrı ayrı listeler ve içeriklerini daha ayrıntılı bir şekilde gösterir. .... { depth: null } parametresi, iç içe geçmiş nesnelerin tamamını göstermek için kullanılır.
});
