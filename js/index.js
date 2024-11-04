// Declarations
form = document.querySelector('#form-expenses');
console.log(form)

// EventListeners
EventListeners()
function EventListeners(){
    document.addEventListener('DOMContentLoaded', askBudget)
    form.addEventListener('submit', validationInput)
}


// Objects
class Budget{
    constructor(budget){
        this.budget = Number(budget)
        this.remaining = Number(budget)
        this.expenses = []
    }
}


class IU {

    fillBudgetField(budgetObj){
        const {budget, remaining} = budgetObj
        document.querySelector('#budget').textContent = budget;
        document.querySelector('#remaining').textContent = remaining;
    }

    showAlert(messege, type){

        const div = document.createElement('DIV');

        // Make conditions for the classes
        if(type === 'error'){
            div.className = 'bg-red-200 text-red-700 px-5 py-3 mb-5 rounded-lg border border-red-300 text-center';
        }
        else if(type === 'succes'){
            div.className ='bg-green-200 text-green-700 px-5 py-3 mb-5 rounded-lg border border-green-300 text-center';
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
}
const iu = new IU();

// Function
function askBudget(){
    const budgetUser = prompt("what is your budget?")

    if(budgetUser==='' || budgetUser <= 0 || isNaN(budgetUser) || budgetUser === 'null' ){
        window.location.reload()
    }
    const budget = new Budget(budgetUser);
    iu.fillBudgetField(budget)
    console.log(budget)
}

function validationInput(e){

    //Prevent the form to submit
    e.preventDefault();

    const expense = document.querySelector('#expense').value;
    const amount = Number(document.querySelector('#amount').value);
    
    if(expense == "" || amount == ""){
        iu.showAlert('All the field are mandatory', 'error');
        console.log(expense, amount)
        return;
    }
    else if(amount === 'null' || isNaN(amount) || amount <= 0){
        iu.showAlert('Invalid amount', 'error');
        return;
    }
    const expenseObj = {expense, amount, id: Date.now()}
    console.log(expenseObj)
    iu.showAlert('Successfully added', 'succes');
    form.reset();
}