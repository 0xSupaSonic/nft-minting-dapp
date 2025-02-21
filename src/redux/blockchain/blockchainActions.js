// constants
import Web3EthContract from "web3-eth-contract";
import { eth, Web3 } from "web3";
// log
import { fetchData } from "../data/dataActions";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    const abiResponse = await fetch("/config/abi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi = await abiResponse.json();
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const CONFIG = await configResponse.json();
    const ethereum = window.ethereum;
    const hasWalletProvider = ethereum && (ethereum.isMetaMask || ethereum.isRabby || ethereum.isCoinbaseWallet || ethereum.isWalletConnect);
    if (hasWalletProvider) {

      await ethereum.enable();
      let web3 = new Web3();
      let contract = new web3.eth.Contract(abi, CONFIG.CONTRACT_ADDRESS);
      contract.setProvider(ethereum);

      try {
        console.log("Requesting accounts...");
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Connected:", accounts[0]);
        console.log("Requesting network ID...");
        const networkId = await ethereum.request({
          method: "net_version",
        });
        console.log("Network ID:", networkId);
        if (networkId == CONFIG.NETWORK.ID) { 
          console.log("Connected to the correct network.");       
          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: contract,
              web3: web3,
            })
          );
          console.log("Dispatched connection success.");
          // Add listeners start
          ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          dispatch(connectFailed(`Change network to ${CONFIG.NETWORK.NAME}.`));
        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
      }
    } 
    else {
      dispatch(connectFailed("No wallet providers detected. Install something like Metamask or Rabby."));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
