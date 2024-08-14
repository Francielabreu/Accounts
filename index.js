const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');
const { type } = require('os');

operation();
function operation() {
    inquirer.prompt([{
            type: 'list',
            name: 'action',
            message: 'O que deseja fazer?',
            choices: [
                'Criar conta',
                'Consultar Saldo',
                'Depositar',
                'Sacar',
                'Sair'
            ]
        }])

        .then((answers) => {
            const action = answers['action']

            if (action == 'Criar conta') {
                createAccount()
            }else if (action == 'Depositar') {
                deposit()
            }else if (action == 'Consultar Saldo') {
                getAccountBalance()
            }else if (action == 'Sacar') {
                withdraw()
            }else if (action == 'Sair') {
                console.log(chalk.bgBlue.black('Obrigado por usar o Accounts.'))
                process.exit()
            }
        })
        .catch((err)=> console.log(err))
}
 
//create an account
function createAccount(){
    console.log(chalk.bgGreen.black('Parabéns por escolher o nosso Banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))

    buildAccount()
}

function buildAccount(){
    
    inquirer.prompt([
        {
            name: 'accountName',
             message: 'Digite um Nome para sua conta!'
        }

    ])
    .then((answer) => {
        const accountName = answer['accountName']
        console.info(accountName)

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')  
        }
        if (fs.existsSync('accounts/' + accountName + '.json')) {
            console.log(chalk.bgRed.black('Esta conta ja existe, escolha outro nome!'))
            buildAccount()
            return
        }
        fs.writeFileSync('accounts/' + accountName + '.json', '{"balance": 0}',function(err){
            console.log(err)
        })

        console.log(chalk.green('Conta criada com sucesso!'))
        operation()
    })
    .catch(err => console.log(err))
}

//add money to an account
function deposit(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
    .then((answer) => {
        const accountName = answer['accountName']

        //verify if account exists
        if (!checkAccount(accountName)) {
            return deposit()
        } 

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto deseja depositar?'
            }
        ])

        .then((answer) => {
            const amount = answer['amount']

            addAmount(accountName, amount)
            operation()
        })
        .catch(err => console.log(err))
        
    })
    .catch(err => console.log(err))
}

function checkAccount(accountName) {
    if (!fs.existsSync('accounts/' + accountName + '.json')) {
        console.log(chalk.bgRed.black('Esta conta não existe, escolha outro nome!'))
        return false
    }

    return true
}

function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde'))
        return deposit()
    }

    const accountBalance = accountData.balance

    const newAccountBalance = parseFloat(accountBalance) + parseFloat(amount)

    fs.writeFileSync(
        'accounts/' + accountName + '.json',
        '{"balance": ' + newAccountBalance + '}',
        function(err) {
            console.log(err)
        }
    )
    console.log(chalk.green('Depósito realizado com sucesso!'))
    console.log(chalk.green('Seu novo saldo é de: ' + newAccountBalance))
    return newAccountBalance
    
}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync('accounts/' + accountName + '.json', 'utf8')
    return JSON.parse(accountJSON)
}

//show balance
function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ])
    .then((answer) => {
        const accountName = answer['accountName']

        //verifiy if account exists 
        if (!checkAccount(accountName)) {
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)
            console.log(chalk.bgBlue.black('Ola, o saldo da sua conta é de R$ :' + accountData.balance))
            operation()
        })
        .catch(err => console.log(err))
}




