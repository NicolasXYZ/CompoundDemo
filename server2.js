const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const config = require('./config.json');
const ethers = require('ethers')
let provider= new ethers.providers.InfuraProvider('rinkeby');


const walletPrivateKey = "0x7fd0583acffe10c073f6fbc4bdf9405d821ba25085928aa6409fe43b76913971";
const web3 = new Web3('https://rinkeby.infura.io/v3/57a1affeb69b411191e1471cbafc75ec');
const wallet = new ethers.Wallet(walletPrivateKey, provider);
let myWalletAddress = wallet.getAddress();
const infuraWalletAdress = '0x9cE7871Af15a4777dd8e6c40A84F3f3f326be6b8'

const cEthAddress = config.cEthAddress;
const cEthAbi = config.cEthAbi;
const cDAIAddress = config.cDAIAddress;
const DAIAddress = config.DAIAddress;
const DAIAbi = config.DAIAbi;
const cDAIAbi = config.cDAIAbi;
const cEthContract = new web3.eth.Contract(cEthAbi, cEthAddress);
const cDAIContract = new web3.eth.Contract(cDAIAbi, cDAIAddress);
const DAIContract = new web3.eth.Contract(DAIAbi, DAIAddress);

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/protocol-balance/eth/').get((req, res) => {
  cEthContract.methods.balanceOfUnderlying(infuraWalletAdress).call()
    .then((result) => {
      const balanceOfUnderlying = web3.utils.fromWei(result);
      return res.send(balanceOfUnderlying);
    }).catch((error) => {
      console.error('[protocol-balance] error:', error);
      return res.sendStatus(400);
    });
});

app.route('/wallet-balance/eth/').get((req, res) => {
  web3.eth.getBalance(infuraWalletAdress).then((result) => {
    const ethBalance = web3.utils.fromWei(result);
    return res.send(ethBalance);
  }).catch((error) => {
    console.error('[wallet-balance] error:', error);
    return res.sendStatus(400);
  });
});


app.route('/wallet-balance/DAI/').get((req, res) => {
    DAIContract.methods.balanceOf(infuraWalletAdress).call().then((result) => {
        const cTokenBalance = result / 1e8;
        return res.send(cTokenBalance.toString());
    }).catch((error) => {
      console.error('[wallet-DAI-balance] error:', error);
      return res.sendStatus(400);
    });
  });

app.route('/wallet-balance/cDAI/').get((req, res) => {
    cDAIContract.methods.balanceOf(infuraWalletAdress).call().then((result) => {
        const cTokenBalance = result / 1e8;
        return res.send(cTokenBalance.toString());
    }).catch((error) => {
      console.error('[wallet-cDAI-balance] error:', error);
      return res.sendStatus(400);
    });
  });


  app.route('/borrow/cDAI/:amount').get((req, res) => {
    if (isNaN(req.params.amount)) {
      return res.sendStatus(400);
    }
  
    cDAIContract.methods.borrow().send({
      from: infuraWalletAdress,
      gasLimit: web3.utils.toHex(5000000),
      gasPrice: web3.utils.toHex(20000000000),
      value: web3.utils.toHex(web3.utils.toWei(req.params.amount))
    }).then((result) => {
      return res.sendStatus(200);
    }).catch((error) => {
      console.error('[supply] error:', error);
      return res.sendStatus(400);
    });
  });

app.route('/wallet-balance/ceth/').get((req, res) => {
  cEthContract.methods.balanceOf(infuraWalletAdress).call().then((result) => {
      const cTokenBalance = result / 1e8;
      return res.send(cTokenBalance.toString());
    }).catch((error) => {
      console.error('[wallet-ctoken-balance] error:', error);
      return res.sendStatus(400);
    });
});

app.route('/supply/eth/:amount').get((req, res) => {
  if (isNaN(req.params.amount)) {
    return res.sendStatus(400);
  }

  cEthContract.methods.mint().send({
    from: myWalletAddress,
    gasLimit: web3.utils.toHex(500000),
    gasPrice: web3.utils.toHex(20000000000),
    value: web3.utils.toHex(web3.utils.toWei(req.params.amount, 'ether'))
  }).then((result) => {
    return res.sendStatus(200);
  }).catch((error) => {
    console.error('[supply] error:', error);
    return res.sendStatus(400);
  });
});

app.route('/redeem/eth/:cTokenAmount').get((req, res) => {
  if (isNaN(req.params.cTokenAmount)) {
    return res.sendStatus(400);
  }

  cEthContract.methods.redeem(req.params.cTokenAmount * 1e8).send({
    from: infuraWalletAdress,
    gasLimit: web3.utils.toHex(500000),
    gasPrice: web3.utils.toHex(20000000000)
  }).then((result) => {
    return res.sendStatus(200);
  }).catch((error) => {
    console.error('[redeem] error:', error);
    return res.sendStatus(400);
  });
});

app.listen(port, () => console.log(`API server running on port ${port}`));
