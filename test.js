
const ethers = require('ethers')
const Web3 = require('web3')
//const web3 = new Web3('http://127.0.0.1:8545');
const providers = ethers.provider
const Compound = require('@compound-finance/compound-js'); // in Node.js

async function main() {
const web3 = new Web3(Web3.givenProvider);
//const web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
//const provider = new ethers.providers.Web3Provider(web3.currentProvider)
let provider= new ethers.providers.InfuraProvider('rinkeby');
//provider = new ethers.providers.JsonRpcProvider()
//provider.listAccounts().then(result => console.log(result))
let accounts = provider.listAccounts()
    .then(result => console.log(result))
    .catch(error => console.log(error))


const deployerAddress = accounts[0];
//const privateKey = accountService.getAccountSigningKey(deployerAddress);
const privateKey= "0x7fd0583acffe10c073f6fbc4bdf9405d821ba25085928aa6409fe43b76913971";
const privateKeyInfura ="0x46570463ca164c73b784317a6cf57cbb";
const wallet = new ethers.Wallet(privateKey, provider);
let myWalletAddress = wallet.getAddress();
myWalletAddress.then((address) => {

    console.log('wallet address', address);
});
//const deployerSigner = provider.getSigner(deployerAddress);
//let wallet = new ethers.Wallet(privateKey, provider);

let balancePromise = wallet.getBalance();

balancePromise.then((balance) => {
    console.log(ethers.utils.formatEther(balance));
});

const InfuraWalletAddress = '0x9cE7871Af15a4777dd8e6c40A84F3f3f326be6b8'

const depositTx = await wallet.sendTransaction({
// ITX deposit contract (same address for all public Ethereum networks)
to: InfuraWalletAddress,
// Choose how much ether you want to deposit to your ITX gas tank
value: ethers.utils.parseUnits('1.5', 'ether')
});

console.log("Mining deposit transaction...");
  console.log(
    `https://${process.env.ETHEREUM_NETWORK}.etherscan.io/tx/${depositTx.hash}`
  );
  const receipt = await depositTx.wait();//var compound = new Compound('http://127.0.0.1:8545');

  // The transaction is now on chain!
  console.log(`Mined in block ${receipt.blockNumber}`);









var compound = new Compound('https://rinkeby.infura.io/v3/57a1affeb69b411191e1471cbafc75ec',{
    privateKey: '0x46570463ca164c73b784317a6cf57cbb',
});

//wallet.connect('https://rinkeby.infura.io/v3/57a1affeb69b411191e1471cbafc75ec',{
//    privateKey: '0x46570463ca164c73b784317a6cf57cbb',
//});// Ethers.js overrides are an optional 3rd parameter for `supply`
// const trxOptions = { gasLimit: 250000, mantissa: false };

(async function() {
  const trxOptions = {
    mantissa: false,
    // from: myWalletAddress, 
  };
  console.log('Supplying ETH to the Compound protocol...');
  const trx = await compound.supply(Compound.ETH, 1, true, trxOptions);
  console.log('Ethers.js transaction object', trx);

})().catch(console.error);

balancePromise.then((balance) => {
    console.log(balance);
    //console.log(exchangeRateCurrent);
    //console.log(ethBalanceWei);
});

}


require("dotenv").config();
main();
  // Waiting for the transaction to be mined
  

