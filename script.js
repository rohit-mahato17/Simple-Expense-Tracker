const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("moneyPlus");
const moneyMins = document.getElementById("moneyMins");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Add Transaction
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please enter both name and amount.");
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value,
  };

  transactions.push(transaction);
  updateLocalStorage();
  addTransactionDOM(transaction);
  updateValues();

  text.value = "";
  amount.value = "";
});

// Generate Random ID
function generateID() {
  return Math.floor(Math.random() * 1000000);
}

// Add Transaction to DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const type = transaction.amount < 0 ? "expense" : "income";

  const item = document.createElement("li");
  item.classList.add(type);

  item.innerHTML = `
    <span class="text">💸 ${transaction.text}</span>
    <span class="amount">${sign}₹${Math.abs(transaction.amount)}</span>
    <button onclick="removeTransaction(${transaction.id})">🗑️</button>
  `;

  list.appendChild(item);
}


// Update Balance, Income and Expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const income = amounts
    .filter(amount => amount > 0)
    .reduce((acc, val) => acc + val, 0)
    .toFixed(2);
  const expense = (
    amounts.filter(amount => amount < 0).reduce((acc, val) => acc + val, 0) * -1
  ).toFixed(2);

  balance.innerText = `₹${total}`;
  moneyPlus.innerText = `+₹${income}`;
  moneyMins.innerText = `-₹${expense}`;
}

// Remove Transaction
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

// Update LocalStorage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize App
function init() {
  list.innerHTML = "";
  if (transactions.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No Transactions Yet";
    list.appendChild(li);
  } else {
    transactions.forEach(addTransactionDOM);
    updateValues();
  }
}


