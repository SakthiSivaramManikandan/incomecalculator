 
    // Select elements
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeSelect = document.getElementById("type");
const addBtn = document.getElementById("add-btn");
const resetBtn = document.getElementById("reset-btn");
const entryList = document.getElementById("entry-list");
const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const netBalanceEl = document.getElementById("net-balance");
const filterRadios = document.querySelectorAll('input[name="filter"]');

let entries = JSON.parse(localStorage.getItem("entries")) || [];
let editIndex = null;

// Render entries and update totals
function renderEntries(filter = "all") {
  entryList.innerHTML = "";
  let totalIncome = 0;
  let totalExpense = 0;

  entries.forEach((entry, index) => {
    if (filter !== "all" && entry.type !== filter) return;

    const li = document.createElement("li");
    li.classList.add("entry-item", entry.type);
    li.innerHTML = `
      <span>${entry.description} - $${entry.amount} (${entry.type})</span>
      <div>
        <button onclick="editEntry(${index})">Edit</button>
        <button onclick="deleteEntry(${index})">Delete</button>
      </div>
    `;
    entryList.appendChild(li);

    if (entry.type === "income") totalIncome += Number(entry.amount);
    if (entry.type === "expense") totalExpense += Number(entry.amount);
  });

  totalIncomeEl.textContent = totalIncome.toFixed(2);
  totalExpenseEl.textContent = totalExpense.toFixed(2);
  netBalanceEl.textContent = (totalIncome - totalExpense).toFixed(2);
}

// Add or update entry
addBtn.addEventListener("click", () => {
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeSelect.value;

  if (!description || isNaN(amount) || amount <= 0) {
    alert("Please enter valid description and amount.");
    return;
  }

  const entry = { description, amount, type };

  if (editIndex !== null) {
    entries[editIndex] = entry;
    editIndex = null;
  } else {
    entries.push(entry);
  }

  localStorage.setItem("entries", JSON.stringify(entries));
  renderEntries();
  resetFields();
});

// Reset input fields
resetBtn.addEventListener("click", resetFields);
function resetFields() {
  descriptionInput.value = "";
  amountInput.value = "";
  typeSelect.value = "income";
  editIndex = null;
}

// Edit entry
window.editEntry = (index) => {
  const entry = entries[index];
  descriptionInput.value = entry.description;
  amountInput.value = entry.amount;
  typeSelect.value = entry.type;
  editIndex = index;
};

// Delete entry
window.deleteEntry = (index) => {
  if (confirm("Are you sure you want to delete this entry?")) {
    entries.splice(index, 1);
    localStorage.setItem("entries", JSON.stringify(entries));
    renderEntries();
  }
};

// Filter entries
filterRadios.forEach(radio => {
  radio.addEventListener("change", () => renderEntries(radio.value));
});

// Initial render
renderEntries();
  