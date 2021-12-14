const fs = require("fs");
const axios = require("axios");
const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const config = {
  producturl: "/products/item/",
  loginurl: "/login",
  baseURL: process.env.BASEURL,
};
let requestConfig = "";
function getAuthHeader(token) {
  const headers = { headers: { Authorization: "Bearer " + token } };
  return headers;
}

function printProductList(products) {
  let list = [];
  products.forEach((product) => {
    let filtered = {
      title: product.title,
      description: product.description,
      price: product.price,
      images: product.images,
    };
    list.push(filtered);
  });
  let data = JSON.stringify(list);
  fs.writeFileSync("input.json", data);
}

function login(email, password) {
  axios
    .post(config.baseURL + config.loginurl, {
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
    })
    .then(function (response) {
      const head = getAuthHeader(response.data.token);
      axios
        .get(config.baseURL + config.producturl, head)
        .then(function (response) {
          const products = response.data;
          printProductList(products);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
}

const products = login();
