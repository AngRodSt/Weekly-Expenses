// Declarations
const form = document.querySelector('#form-expenses');
const expenseList = document.querySelector('#expenses-list');
console.log(form)

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

    calculateRemaining(){
            const spent = this.expenses.reduce((total,expense)=> total + Number(expense.amount), 0);
            this.remaining = this.budget - spent;

    }
}


class IU {

    fillBudgetField(budgetObj) {
        const { budget, remaining } = budgetObj
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

    updateRemaining(remaining){
        document.querySelector('#remaining').textContent = remaining;
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
            const btnDelete = document.createElement('button');
            btnDelete.className = 'bg-red-600  text-white px-2 py-1 rounded-md mb-1';
            btnDelete.textContent = 'Borrar x'
            div.appendChild(btnDelete);
            expenseList.appendChild(div);
        });
    }
}
const iu = new IU();
let budget;
// Function
function askBudget() {
    const budgetUser = prompt("what is your budget?")

    if (budgetUser === '' || budgetUser <= 0 || isNaN(budgetUser) || budgetUser === 'null') {
        window.location.reload()
    }
    budget = new Budget(budgetUser);
    iu.fillBudgetField(budget)
    console.log(budget)
}

function validationInput(e) {

    //Prevent the form to submit
    e.preventDefault();

    const expense = document.querySelector('#expense').value;
    const amount = Number(document.querySelector('#amount').value);

    if (expense == "" || amount == "") {
        iu.showAlert('All the field are mandatory', 'error');
        console.log(expense, amount)
        return;
    }
    else if (amount === 'null' || isNaN(amount) || amount <= 0) {
        iu.showAlert('Invalid amount', 'error');
        return;
    }


    const expenseObj = { expense, amount, id: Date.now() }

    iu.showAlert('Successfully added', 'succes');
    budget.addNewExpense(expenseObj)

    const { expenses, remaining } = budget;
    iu.addExpensesHTML(expenses)
    form.reset();
    console.log(remaining)
    iu.updateRemaining(remaining)
    
}


function clearHTML(){
    while(expenseList.firstChild){
        expenseList.removeChild(expenseList.firstChild);
    }
}