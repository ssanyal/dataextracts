const fs = require("fs");
const axios = require("axios");
const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const config = {
  producturl: "/products/item/",
  categoryurl: "/products/category/",
  loginurl: "/login",
  baseURL: process.env.BASEURL,
};

function getAuthHeader(token) {
  const headers = { headers: { Authorization: "Bearer " + token } };
  return headers;
}

function formatProductList(products, categories) {
  list = products.map((product) => {
    return {
      title: product.title,
      description: product.description,
      categories: categories.find(
        (category) => category.id == product.categories[0]
      ).name,
      price: product.price,
      rating: product.rating,
      displayrank: product.displayRank,
      status: product.status,
      images: product.images,
      tags: product.tags,
    };
  });
  return list;
}

function print(list) {
  let data = JSON.stringify(list);
  fs.writeFileSync("input.json", data);
}

async function login(email, password) {
  const response = await axios.post(config.baseURL + config.loginurl, {
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
  });
  return response.data.token;
}
async function getProducts(head) {
  const response = await axios.get(config.baseURL + config.producturl, head);
  return response.data;
}
async function getCategory(head) {
  console.log(config.baseURL + config.categoryurl);
  const response = await axios.get(config.baseURL + config.categoryurl, head);
  return response.data;
}

async function main() {
  const token = await login(process.env.EMAIL, process.env.PASSWORD);
  const head = await getAuthHeader(token);
  const products = await getProducts(head);
  const categories = await getCategory(head);
  const list = formatProductList(products, categories);
  print(list);
}

(async function () {
  await main();
})();
