import puppeteer from "puppeteer";

const SCRAPE_TIME = 6 * 60 * 60 * 1000;
const URL = "https://";

interface Product {
  title: string;
  price: string;
  discount: string;
}

async function scrapeWebsite() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(URL);

  // search for products with promo codes, coupon codes, or discounts
  const products: Product[] = await page.$$eval(".product", (elements) => {
    const productsWithDiscounts: Product[] = [];

    for (const element of elements) {
      const titleElement = element.querySelector(".product-title");
      const priceElement = element.querySelector(".product-price");
      const discountElement = element.querySelector(".product-discount");

      if (titleElement && priceElement && discountElement) {
        const title = titleElement.textContent?.trim() || "";
        const price = priceElement.textContent?.trim() || "";
        const discount = discountElement.textContent?.trim() || "";

        productsWithDiscounts.push({ title, price, discount });
      }
    }

    return productsWithDiscounts;
  });

  console.log("Goods with Discounts:");
  for (const product of products) {
    console.log(`Title: ${product.title}`);
    console.log(`Price: ${product.price}`);
    console.log(`Discount: ${product.discount}`);
  }

  await browser.close();

  setTimeout(scrapeWebsite, SCRAPE_TIME);
}

scrapeWebsite().catch((err) => {
  console.error("Error occurred during scraping:", err);
});
