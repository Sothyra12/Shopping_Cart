// script.js
const cartContainer = document.getElementById("cart-container");
const productsContainer = document.getElementById("products-container");
const dessertCards = document.getElementById("dessert-card-container");
const cartBtn = document.getElementById("cart-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");
const totalNumberOfItems = document.getElementById("total-items");
const cartSubTotal = document.getElementById("subtotal");
const cartTaxes = document.getElementById("taxes");
const cartTotal = document.getElementById("total");
const showHideCartSpan = document.getElementById("show-hide-cart");
let isCartShowing = false;

const products = [
  {
    id: 1,
    name: "Vanilla Cupcakes (6 Pack)",
    price: 12.99,
    category: "Cupcake",
  },
  {
    id: 2,
    name: "French Macaron",
    price: 3.99,
    category: "Macaron",
  },
  {
    id: 3,
    name: "Pumpkin Cupcake",
    price: 3.99,
    category: "Cupcake",
  },
  {
    id: 4,
    name: "Chocolate Cupcake",
    price: 5.99,
    category: "Cupcake",
  },
  {
    id: 5,
    name: "Chocolate Pretzels (4 Pack)",
    price: 10.99,
    category: "Pretzel",
  },
  {
    id: 6,
    name: "Strawberry Ice Cream",
    price: 2.99,
    category: "Ice Cream",
  },
  {
    id: 7,
    name: "Chocolate Macarons (4 Pack)",
    price: 9.99,
    category: "Macaron",
  },
  {
    id: 8,
    name: "Strawberry Pretzel",
    price: 4.99,
    category: "Pretzel",
  },
  {
    id: 9,
    name: "Butter Pecan Ice Cream",
    price: 2.99,
    category: "Ice Cream",
  },
  {
    id: 10,
    name: "Rocky Road Ice Cream",
    price: 2.99,
    category: "Ice Cream",
  },
  {
    id: 11,
    name: "Vanilla Macarons (5 Pack)",
    price: 11.99,
    category: "Macaron",
  },
  {
    id: 12,
    name: "Lemon Cupcakes (4 Pack)",
    price: 12.99,
    category: "Cupcake",
  },
];

// Display all products in the html using forEach
// destructuring the object to get the name, id, price, and category
// used += to append the html to the dessertCards div to make sure all products are displayed and not replaced with the new product's content when it is added
products.forEach(({ name, id, price, category }) => {
  dessertCards.innerHTML += `
        <div class="dessert-card">
          <h2>${name}</h2>
          <p class="dessert-price">$${price}</p>
          <p class="product-category">Category: ${category}</p>
          <button 
            id="${id}" 
            class="btn add-to-cart-btn">Add to cart
          </button>
        </div>
      `;
});

// a class is like a blueprint for creating objects. It allows you to define a set of properties and methods, and instantiate (or create) new objects with those properties and methods.
class ShoppingCart {
  // the constructor method is a special method for creating and initializing an object created with a class. It is a great place to initialize the properties of the class.
  // It is called when the new instance of the class is instantiated.
  constructor() {
    // this keyword is used to refer to the current instance (object) of the class being created.
    // ex: this.propertyName = value means that "For this object I'm creating, set the property called propertyName to the specified value."
    this.items = [];
    this.total = 0;
    this.taxRate = 8.25;
  }

  addItem(id, products) {
    // find the product id the user added in the products array using .find()
    const product = products.find((item) => item.id === id);
    // destructuring to extract name and price variables from product.
    const { name, price } = product;
    this.items.push(product);

    const totalCountPerProduct = {};
    this.items.forEach((dessert) => {
      // Wrap the right-hand totalCountPerProduct[dessert.id] in parentheses, and add || 0 to the end of the expression in case the item is not in the object yet meaning it is undefined resulting in NaN when trying to add 1 to it.
      totalCountPerProduct[dessert.id] =
        (totalCountPerProduct[dessert.id] || 0) + 1;
    });

    const currentProductCount = totalCountPerProduct[product.id];
    const currentProductCountSpan = document.getElementById(
      `product-count-for-id${id}`
    );

    currentProductCount > 1
      ? (currentProductCountSpan.textContent = `${currentProductCount}x`)
      : (productsContainer.innerHTML += `
      <div id="dessert${id}" class="product">
        <p>
          <span class="product-count" id="product-count-for-id${id}"></span>${name}
        </p>
        <p>${price}</p>
      </div>
      `);
  }

  getCounts() {
    return this.items.length;
  }

  clearCart() {
    if (!this.items.length) {
      alert("Your cart is already empty!");
      return;
    }
    // confirm() is a browser built-in function that prompt to the user. confirm() accepts a string, which is the message displayed to the user and returns true if the user confirms, else false if the user cancels.
    const isCartCleared = confirm(
      "Are you sure you want to clear all items from your shopping cart?"
    );
    if (isCartCleared) {
      this.items = [];
      this.total = 0;
      productsContainer.innerHTML = "";
      totalNumberOfItems.textContent = 0;
      cartSubTotal.textContent = 0;
      cartTaxes.textContent = 0;
      cartTotal.textContent = 0;
    }
  }

  calculateTaxes(amount) {
    return parseFloat(((this.taxRate / 100) * amount).toFixed(2));
  }

  // update the total price of each items in the cart
  calculateTotal() {
    const subTotal = this.items.reduce((total, item) => total + item.price, 0);
    const tax = this.calculateTaxes(subTotal);
    this.total = subTotal + tax;
    cartSubTotal.textContent = `$${subTotal.toFixed(2)}`;
    cartTaxes.textContent = `$${tax.toFixed(2)}`;
    cartTotal.textContent = `$${this.total.toFixed(2)}`;
    return this.total;
  }
}

// instantiating a new ShoppingCart object meaning creating a new object based on the ShoppingCart class.
const cart = new ShoppingCart();
const addToCartBtns = document.getElementsByClassName("add-to-cart-btn");
// converting the HTMLCollection to an array using the spread operator as the getElementsByClassName() returns an HTMLCollection which does not have the forEach method.
[...addToCartBtns].forEach((btn) =>
  btn.addEventListener("click", (event) => {
    cart.addItem(Number(event.target.id), products);
    totalNumberOfItems.textContent = cart.getCounts();
    cart.calculateTotal();
  })
);

cartBtn.addEventListener("click", () => {
  // !isCartShowing means invert the value of isCartShowing with the ! operator
  isCartShowing = !isCartShowing;
  showHideCartSpan.textContent = isCartShowing ? "Hide" : "Show";
  cartContainer.style.display = isCartShowing ? "block" : "none";
});

// bind() is a method that creates a new function that, when called, has its this keyword set to the provided value.
// used bind() to bind the clearCart method to the cart object so that the this keyword in the clearCart method refers to the cart object.
clearCartBtn.addEventListener("click", cart.clearCart.bind(cart));