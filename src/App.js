import "./App.css";
import * as bip39 from "bip39";
import { HDKey } from "micro-ed25519-hdkey";
import { Keypair } from "@solana/web3.js";
import { Buffer } from "buffer";
import { useState } from "react";

window.Buffer = Buffer;

function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [wallets, setWallets] = useState([]);

  const generateMne = () => {
    setMnemonic(bip39.generateMnemonic());
  };
  const mnemonicWords = mnemonic ? mnemonic.split(" ") : [];

  const genMultipleWallet = () => {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const hd = HDKey.fromMasterSeed(seed.toString("hex"));

    const path = `m/44'/501'/${wallets.length}'/0'`;
    const keypair = Keypair.fromSeed(hd.derive(path).privateKey);
    const publicKey = keypair.publicKey.toBase58();

    console.log(publicKey);
    setWallets([...wallets, publicKey]);
  };

  return (
    <>
      <div className="App">
        <h1>Web Wallet </h1>
        <div className="mnemonic-container">
          {mnemonicWords.length > 0 ? (
            mnemonicWords.map((word, index) => <p key={index}>{word}</p>)
          ) : (
            <p>
              No mnemonic generated. Click "Generate Mnemonic" to create one.
            </p>
          )}
        </div>
        <button onClick={generateMne} className="btn">
          Generate Mnemonic
        </button>
        <br />
        <div className="mul-wallet">
          <button className="btn" onClick={genMultipleWallet}>
            Generate Wallets
          </button>
          <div>
            {wallets.map((wallet, index) => (
              <div key={index}>
                <p className="wallet">
                  {index}. {wallet}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
