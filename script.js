
const Modal = {
  openClose() {
    const $modal = document.querySelector(".modal-overlay")
    $modal.classList.toggle("-active")
  },
}

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("jj.finances:transaction")) || []
  },
  set(transactions) {
    localStorage.setItem("jj.finances:transaction", JSON.stringify(transactions))
  }
}
// const transactions = [
//   {
//     id: 1,
//     description: 'Luz',
//     amount: -50011,
//     date: '23/01/2021'
//   },
//   {
//     id: 2,
//     description: 'website',
//     amount: 574365,
//     date: '23/01/2021'
//   },
//   {
//     id: 3,
//     description: 'Internet',
//     amount: -20002,
//     date: '23/01/2021'
//   },
// ]

const Transaction = {

  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction)
    App.reload()
  },

  remove(index) {
   Transaction.all.splice(index, 1)
   App.reload()
  },

  incomes() { //somar as entras
    let income = 0

    Transaction.all.forEach(transaction => {
      if(transaction.amount > 0){
        income += transaction.amount
      }
    })


    return income
  },

  expenses() { //somar as saídas
    let expense = 0

    Transaction.all.forEach(transaction => {
      if(transaction.amount < 0) {
        expense += transaction.amount
      }
    })

    return expense
  },

  total() { //entradas - saídas 
    const total = Transaction.expenses() + Transaction.incomes()

    return total
  }
}

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(transaction, index) {

    const CSSclass = transaction.amount > 0 ? "income" : "expense"
    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
    <td class="description"> ${transaction.description} </td>
    <td class="${CSSclass}"> ${amount} </td>
    <td class="date"> ${transaction.date} </td>
    <td class="icon-item">
      <img onclick="Transaction.remove(${index})" class="-remove" src="./assets/minus.svg" alt="remover transação">
    </td>
    `

    return html
  },

  updateBalance() {
    document
      .querySelector(".card.-income p")
      .innerHTML = Utils.formatCurrency(Transaction.incomes())
    document
      .querySelector(".card.-expense p")
      .innerHTML = Utils.formatCurrency(Transaction.expenses())
    document
      .querySelector(".card.-total p")
      .innerHTML = Utils.formatCurrency(Transaction.total())
    
  },

  clearTransaction() {
    DOM.transactionsContainer.innerHTML = ''
  }

}

const Utils = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : ""
    

    value = String(value).replace(/\D/g ,"")
    value = Number(value) / 100

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })

    return signal + ' ' + value

  },

  formatAmount(value) {
    value = Number(value) * 100
    return Math.round(value)
  },

  formatDate(value) {

    const splittedDate = value.split("-")

    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  }
}


const Form = {

  $description: document.querySelector("#description"),
  $amount: document.querySelector("#amount"),
  $date: document.querySelector("#date"),

  getValue() {
    return {
      description: Form.$description.value,
      amount: Form.$amount.value,
      date: Form.$date.value
    }
  },

  validateFields(){

    const { description, amount, date } = Form.getValue()

    if( description.trim() === "" ||
        amount.trim() === "" ||
        date.trim() === "" ) {
          throw new Error("Por favor, preencha todos os campos")
        }

  },

  formatValues() {
    let { description, amount, date } = Form.getValue()

    amount = Utils.formatAmount(amount)
    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  },

  clearFields() {
    Form.$description.value = ""
    Form.$amount.value = ""
    Form.$date.value = ""
  },

  submit(event) {
    event.preventDefault()  
    
    try {

      Form.validateFields()
      const transaction = Form.formatValues()
      Transaction.add(transaction)
      Form.clearFields()
      Modal.openClose()
      
    } catch (error) {
      alert(error.message)
    }
    
    
  },


}




const App = {
  init() {
    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index)
    })
    DOM.updateBalance()

    Storage.set(Transaction.all)

    
  },
  reload() {
    DOM.clearTransaction()
    App.init()
  },

  
}

App.init()


