import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";

const logout = async () => {
  Accounts.web3.address = "";
  Meteor.logout();
}

const enableWeb3 = async () => {
  const Web3Modal = window.exports.Web3Modal.default
  const providerOptions = Meteor.settings.public.providers;

  if (Object.keys(Meteor.settings.public)==0) {
    console.error("Remember to specify --settings settings.json !");
    return false;
  }

  if (providerOptions && providerOptions.walletconnect) {
    providerOptions.walletconnect.package = WalletConnectProvider
  }

  web3Modal = new Web3Modal({
    network: Meteor.settings.public.network,
    cacheProvider: false,
    providerOptions,
    disableInjectedProvider: false
  })

  try {
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    return provider;
  } catch (e) {
    console.error('Could not get a wallet connection', e)
    return false;
  }
}

const signLoginRequest = async (address, nonce) => {
  let message = "This is a login request for " + Meteor.settings.public.appName + ". \nIt does not cost anything. \nNonce: " + nonce;

  signature = await signer.signMessage(message);

  Meteor.call('validateLogin', {
    address: address,
    signature: signature
  }, (err, res) => {
    if (err) {
      console.error(err);
    } else {
      const token = res.token;
      Meteor.loginWithToken(token, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      })
    }
  });

  return false;
}

Accounts.web3 = {
  login: async (options, callback) => {
    options = { ...options };

    let provider = await enableWeb3();
    signer = provider.getSigner();

    if (provider) {
      Accounts.web3.provider = provider.provider;

      const address = Accounts.web3.provider.selectedAddress;

      await Meteor.call('getNonce', {
        address: address
      }, async (err, res) => {
        if (err) {
          console.error(err);
        } else {
          const nonce = res;
          await signLoginRequest(address, nonce);
        }
      });

    } else {
      alert("No web3 providers connected!")
    }
  },
  logout
};



Meteor.startup(() => { });