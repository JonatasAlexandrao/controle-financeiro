
const Modal = {
  openClose() {
    const $modal = document.querySelector(".modal-overlay")
    $modal.classList.toggle("-active")
  },
}


const transactions = [
  {
    id: 1,
    description: 'Luz',
    amount: -50011,
    date: '23/01/2021'
  },
  {
    id: 2,
    description: 'website',
    amount: 574365,
    date: '23/01/2021'
  },
  {
    id: 3,
    description: 'Internet',
    amount: -20002,
    date: '23/01/2021'
  },
]

const Transaction = {

  all: transactions,

  add(transaction) {
    Transaction.all.push(transaction)
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
    tr.innerHTML = DOM.innerHTMLTransaction(transaction)

    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(transaction) {

    const CSSclass = transaction.amount > 0 ? "income" : "expense"
    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
    <td class="description"> ${transaction.description} </td>
    <td class="${CSSclass}"> ${amount} </td>
    <td class="date"> ${transaction.date} </td>
    <td class="icon-item">
      <img class="-remove" src="./assets/minus.svg" alt="remover transação">
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

  }
}



const App = {
  init() {
    Transaction.all.forEach(transaction => {
      DOM.addTransaction(transaction)
    })
    DOM.updateBalance()

    
  },
  reload() {
    DOM.clearTransaction()
    App.init()
  },

  
}

App.init()


Transaction.add({
  id: 50,
  description: 'aaaa',
  amount: 200,
  date: '20/05/2021'
})

