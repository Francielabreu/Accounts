const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');
const { type } = require('os');

operetion();
function operetion() {
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
        operetion()
    })
    .catch(err => console.log(err))
}





