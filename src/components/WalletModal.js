import React from "react";
import Modal from "react-modal";
import metamaskLogo from "../assets/metamask.svg";
import walletConnectLogo from "../assets/walletconnect.svg";
import coinbaseLogo from "../assets/coinbase.svg";
import rabbyLogo from "../assets/rabby.svg";

Modal.setAppElement("#root"); // Ensure accessibility

const WalletModal = ({ isOpen, onClose, onConnect }) => {
  const wallets = [
    { name: "Rabby Wallet", logo: rabbyLogo, id: "rabby" },
    { name: "MetaMask", logo: metamaskLogo, id: "metamask" },
    { name: "Coinbase Wallet", logo: coinbaseLogo, id: "coinbase" },
    { name: "WalletConnect", logo: walletConnectLogo, id: "walletconnect" },
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose}
      className="wallet-modal"
      overlayClassName="wallet-modal-overlay"
    >
      <h2>Connect Wallet</h2>
      <br/>
      <button className="close-btn" onClick={onClose}>×</button>
      <div className="wallet-options">
        {wallets.map(wallet => (
          <button key={wallet.id} className="wallet-btn" onClick={() => onConnect(wallet.id)}>
            <img src={wallet.logo} alt={wallet.name} className="wallet-logo" />
          </button>
        ))}
      </div>
    </Modal>
  );
};

export default WalletModal;
