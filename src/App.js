import Upload from "./artifacts/contracts/Upload.sol/Upload.json";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";
function App() {
  const [account, SetAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        SetAccount(address);
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        // console.log(contract); 0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("METAMASK IS NOT INSTALLED");
      }
    };
    provider && loadProvider();
  }, []);
  return (
    <>
      {!modalOpen && (
        <button className="share" onClick={()=>setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}
      <div className="App">
        <h1 style={{ color: "white" }}>GDrive 3.0</h1>
        <div class="bg"></div>
        <div class="bg bg2"></div>
        <div class="bg bg3"> </div>
        <p style={{ color: "white" }}>
          Account :{account ? account : "NOT CONNECTED"}
        </p>
        <FileUpload
          account={account}
          provider={provider}
          contract={contract}
        ></FileUpload>
        <Display contract={contract} account={account}></Display>
      </div>
    </>
  );
}

export default App;
