const ethers = require('ethers')
const chalk = require('chalk')
require('dotenv').config();

const WBNB = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
const tokenAddress = process.env.TokenContract
const balance_bnb = ethers.utils.parseUnits(process.env.amount_WBNB_buy, 'ether')
const gasPrice = ethers.utils.parseUnits(process.env.Gwei, 'gwei')
const gasLimit = process.env.Gas
const txNumberForAntibot = process.env.nrOfTransactionsToDo 
const WSS = process.env.QuickNodeMainNet 
const privateKey = process.env.privateKey

const provider = new ethers.providers.WebSocketProvider(WSS)
const wallet = new ethers.Wallet(privateKey)
const myAddress = wallet.address
const account = wallet.connect(provider)

const bsContractAddress = '0x39131A791463FcfD894abe3F677884C6697C1963'
const bsContract = new ethers.Contract(
    bsContractAddress,
    [
        'function buy(address[] calldata path, address to, uint times) external payable returns (uint[] memory amounts)',
        'function sell(uint amountIn, address[] calldata path, address to, uint times) external returns (uint[] memory amounts)'
    ],
    account
);

const tokenContract = new ethers.Contract(
    tokenAddress,
    ['function approve(address spender, uint256 amount) external returns (bool)'],
    account
);

const buy = async () => {
    const buytx = await bsContract.buy(
        [WBNB, tokenAddress],
        myAddress,
        txNumberForAntibot,
        { value: utils.parseEther(balance_bnb), gasLimit: gasLimit, gasPrice: gasPrice, nonce: currentNonce++ }
    ) 
    await buytx.wait() 
}

const sell = async () => {
    const approvetx = await tokenContract.approve(
        bsContractAddress,
        ethers.BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
        { gasLimit: gasLimit, gasPrice: gasPrice, nonce: currentNonce++ }
    )
    await approvetx.wait()

    const selltx = await bsContract.buy(
        balance_token, 
        [tokenAddress, WBNB],
        myAddress,
        txNumberForAntibot,
        { gasLimit: gasLimit, gasPrice: gasPrice, nonce: currentNonce++ }
    ) 
    await selltx.wait() 
}

const run = async () => {
    await buy();
    await sell();
}

run();