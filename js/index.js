// Declarations
const form = document.querySelector('#form-expenses');
const expenseList = document.querySelector('#expenses-list');


// EventListeners
EventListeners()
function EventListeners() {
    document.addEventListener('DOMContentLoaded', askBudget)
    form.addEventListener('submit', validationInput)
}


// Objects
class Budget {
    constructor(budget) {
        this.budget = Number(budget)
        this.remaining = Number(budget)
        this.expenses = []
    }

    //Add new expense to the array
    addNewExpense(expense) {
        this.expenses = [...this.expenses, expense]
        this.calculateRemaining();
    }

    calculateRemaining() {
        const spent = this.expenses.reduce((total, expense) => total + Number(expense.amount), 0);
        this.remaining = this.budget - spent;

    }

    deleteExpense(id) {
        this.expenses = this.expenses.filter((expense) => expense.id != id);
        iu.addExpensesHTML(this.expenses)
        this.calculateRemaining();

    }
}


class IU {

    fillBudgetField(budgetObj) {
        // Destructuring the object
        const { budget, remaining } = budgetObj

        // Fill the fields
        document.querySelector('#budget').textContent = budget;
        document.querySelector('#remaining').textContent = remaining;
    }

    showAlert(messege, type) {

        const div = document.createElement('DIV');

        // Make conditions for the classes
        if (type === 'error') {
            div.className = 'bg-red-200 text-red-700 px-5 py-3 mb-5 rounded-lg border border-red-300 text-center';
        }
        else if (type === 'succes') {
            div.className = 'bg-green-200 text-green-700 px-5 py-3 mb-5 rounded-lg border border-green-300 text-center';
        }
        div.textContent = messege;
        document.querySelector('#right').insertBefore(div, form);

        // Disable the button to only show one alert at a time
        const btnForm = form.querySelector('button[type="submit"]');
        btnForm.setAttribute('disabled', true);
        btnForm.classList.add('bg-gray-200', 'border-gray-300', 'text-gray-500')

        // Set a timer for the alerts
        setTimeout(() => {
            div.remove();
            btnForm.removeAttribute('disabled');
            btnForm.classList.remove('bg-gray-200', 'border-gray-300', 'text-gray-500')
        }, 3000);

    }

    updateRemaining(remaining) {
        //update the remaining in the HTML
        document.querySelector('#remaining').textContent = remaining;
        const btnForm = form.querySelector('button[type="submit"]');
        if (remaining <= 0) {
            this.showAlert('The budget has been exhausted', 'error');
            setTimeout(() => {
                btnForm.setAttribute('disabled', true);
                btnForm.classList.add('bg-gray-200', 'border-gray-300', 'text-gray-500');
            }, 3000);
            return;
        }
        btnForm.removeAttribute('disabled');
        btnForm.classList.remove('bg-gray-200', 'border-gray-300', 'text-gray-500')
    }

    addExpensesHTML(expenseObj) {

        clearHTML();
        // Iterate with each element of the object and create the html
        expenseObj.forEach(exp => {
            const { expense, amount, id } = exp;
            const div = document.createElement('DIV');
            div.className = 'p-4 border flex md:flex-row flex-col justify-between mb-5'
            div.innerHTML = `
                 <p class="mt-2 text-center">${expense}: </p>
                 <p class="bg-green-200 border border-green-300 px-2 py-1 font-bold text-center mb-1 text-green-900  rounded-md">$${amount}</p>
            `
            //Create a button to delete the expense
            const btnDelete = document.createElement('button');
            btnDelete.className = 'bg-red-600  text-white px-2 py-1 rounded-md mb-1';
            btnDelete.textContent = 'Borrar x'
            btnDelete.onclick = (e) => {
                budget.deleteExpense(id);
                const { remaining } = budget;
                this.updateRemaining(remaining);
                this.updateColorRemaining(budget);
            }
            div.appendChild(btnDelete);
            expenseList.appendChild(div);
        });

    }

    updateColorRemaining(budgetObj) {

        //update the color of the remaining
        const { budget, remaining } = budgetObj
        const remainingHTML = document.querySelector('#remaining').parentElement.parentElement;
        if ((budget / 4) > remaining) {
            remainingHTML.className = 'bg-red-100 text-red-700 px-5 py-3 mb-5 rounded-lg border border-red-200'
        }
        else if ((budget / 2) > remaining) {
            remainingHTML.className = 'bg-orange-100 text-orange-700 px-5 py-3 mb-5 rounded-lg border border-orange-200"'
        }
        else {
            remainingHTML.className = 'bg-green-100 text-green-700 px-5 py-3 mb-5 rounded-lg border border-green-200'
        }

    }
}
const iu = new IU();
let budget;

// Functions
function askBudget() {
    //Ask the user for the budget
    let budgetUser = prompt("what is your budget? enter the amount ")

    while(budgetUser === '' || budgetUser <= 0 || isNaN(budgetUser) || budgetUser === null) {
        budgetUser = prompt("Invalid amount, try again ");
    }
    if(budgetUser === '' || budgetUser <= 0 || isNaN(budgetUser) || budgetUser === null) {
        window.location.reload();
    }
    budget = new Budget(budgetUser);
    iu.fillBudgetField(budget)
}


function validationInput(e) {

    //Prevent the form to submit
    e.preventDefault();

    //Get the values from the form
    const expense = document.querySelector('#expense').value;
    const amount = Number(document.querySelector('#amount').value);

    //Validate the values
    if (expense == "" || amount == "") {
        iu.showAlert('All the field are mandatory', 'error');
        return;
    }
    else if (amount === 'null' || isNaN(amount) || amount <= 0) {
        iu.showAlert('Invalid amount', 'error');
        return;
    }
    //Create the object with the expense and show the alert
    const expenseObj = { expense, amount, id: Date.now() }
    iu.showAlert('Successfully added', 'succes');
    budget.addNewExpense(expenseObj)

    //Print the expenses and update the remaining
    const { expenses, remaining } = budget;
    iu.addExpensesHTML(expenses)
    form.reset();
    iu.updateRemaining(remaining)
    iu.updateColorRemaining(budget);

}


function clearHTML() {
    //Clean the HTML when a new expense is added
    while (expenseList.firstChild) {
        expenseList.removeChild(expenseList.firstChild);
    }
}