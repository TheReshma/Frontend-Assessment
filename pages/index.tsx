import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Connect } from "../src/ConnectButton";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useState } from "react";
import { useIsMounted } from "./hooks/useIsMounted";

export default function Home() {
  const [balance, setBalance] = useState("");
  const [chainId, setChainId] = useState<number>();
  const { address } = useAccount();
  const mounted = useIsMounted();

  const getBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      const bigN = await provider.getBalance(address as string);
      const bal = ethers.utils.formatEther(bigN);
      setBalance(bal);
      console.log(bal);
    }
  };

  const getChainId = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      const accounts = await provider.getNetwork();
      console.log(accounts.chainId);
      setChainId(accounts.chainId);
    }
  };

  const sendTransaction = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      const params = [
        {
          from: address,
          to: address,
          value: ethers.utils.parseUnits("0", "ether").toHexString(),
        },
      ];

      const transactionHash = await provider.send(
        "eth_sendTransaction",
        params
      );
      console.log("transactionHash is " + transactionHash);
    }
  };

  if (mounted)
    return (
      <div className={styles.container}>
        <Head>
          <title>Another Web3.0 App</title>
          <meta name="description" content="Web3 app to test stuff" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className={styles.blob}></div>
          <div className={styles.card}>
            <h1>Another Web3.0 App</h1>

            {address && (
              <>
                <p>{address}</p>
                <p>{chainId}</p>
                <button onClick={() => getChainId()}>Get Chain Id</button>
                <p>{balance}</p>
                <button onClick={() => getBalance()}>Get Balance</button>
                <button onClick={() => sendTransaction()}>
                  Send Transaction
                </button>
              </>
            )}
            <Connect />
          </div>
        </main>
      </div>
    );
}
