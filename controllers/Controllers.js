const ethers = require('ethers')
const Web3 = require('web3')
const providers = ethers.provider

/*
exports.list_all_tasks = function(req, res) {
    Task.find({}, function(err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });
  };
*/

exports.startGanache = function(req, res) {

    var exec = require('child_process').exec, child;
    child = exec('sh ./run_ganache2.sh',
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);

        
        if (error !== null) {
             console.log('exec error: ' + error);
             res.send(error);
        }
        console.log('Ganache started');
        res.send(stderr)
    });
};

exports.list_Eth_wallets = function (req, res) {

    const web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    const provider = new ethers.providers.Web3Provider(web3Provider)

    let accounts = provider.listAccounts()
        .then(result => console.log(result))
        .catch(error => console.log(error))



    const deployerAddress = accounts[0];
    //const privateKey = accountService.getAccountSigningKey(deployerAddress);
    const privateKey = "0x7fd0583acffe10c073f6fbc4bdf9405d821ba25085928aa6409fe43b76913971";
    const wallet = new ethers.Wallet(privateKey, provider);

    //const deployerSigner = provider.getSigner(deployerAddress);
    //let wallet = new ethers.Wallet(privateKey, provider);

    let balancePromise = wallet.getBalance();
    //const balance = ethers.utils.formatEther(balancePromise);
    var response = {
        "text": "balance" + balancePromise
    };
    res.send(JSON.stringify(response));
    //child();
};

