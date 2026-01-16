import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { createContext } from "react";
import { contractAddress, contractABI } from "../utils/constants";

const Web3Context = createContext();

const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const ethereumProvider = await detectEthereumProvider(); // connected with metamask/wallet

        if (ethereumProvider) {
          const ethersProvider = new ethers.providers.Web3Provider(
            ethereumProvider
          );
          setProvider(ethersProvider);

          const accounts = await ethereumProvider.request({
            method: "eth_requestAccounts",
          }); // fetching the accounts of the connected metamask

          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }

          const signer = ethersProvider.getSigner();
          const contractInstance = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          ); // creating contract instance
          setContract(contractInstance);

          const ownerAddress = await contractInstance.owner(); // fetching owner address from created contract instance
          setIsOwner(ownerAddress.toLowerCase() === accounts[0].toLowerCase());
        } else {
          console.log("Please install metamask");
        }
      } catch (error) {
        console.error("Error Web3 initializing", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts) => {
        // to change account
        if (accounts.length > 0) {
          setAccount(accounts[0]);

          if (contract) {
            const ownerAddress = await contract.owner();
            setIsOwner(
              ownerAddress.toLowerCase() === accounts[0].toLowerCase()
            );
          } else {
            setAccount(null);
            setIsOwner(false);
          }
        }

        window.ethereum.on("accountsChanged", handleAccountsChanged); // checking if the account is changed

        return () => {
          window.ethereum.removeListListener(
            "accountsChanged",
            handleAccountsChanged
          );
        };
      };
    }
  }, [contract]);

  const connectWallet = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts);

        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        ); // creating contract instance
        setContract(contractInstance);

        const ownerAddress = await contract.owner();
        setIsOwner(ownerAddress.toLowerCase() === accounts[0].toLowerCase());

        return true;
      } catch (error) {
        console.error("Error connecting wallet : ", error);
      }
    };

  //   listing products
    const listProduct = async (
      id,
      name,
      category,
      image,
      price,
      review,
      stock
    ) => {
      try {
        if (!contract || !isOwner) return false;

        const priceInWei = ethers.utils.parseEther(price.toString());

        const transaction = await contract.list(
          id,
          name,
          category,
          image,
          priceInWei,
          review,
          stock
        ); // fetching the list function from the solidity contract

        await transaction.wait();

        return true;
      } catch (error) {
        console.error("Error listing product", error);
      }
    };

  const simpleBuy = async (id) => {
    try {
      if (!contract || !account)
        return { success: false, error: "No contract or account" };

      const product = await contract.products(id);
      const productPrice = product.price;

      const signer = provider.getSigner();

      const transaction = await signer.sendTransaction({
        to: contractAddress,
        data: contract.interface.encodedFunctionData("buy", [id]),
        value: productPrice,
        gasLimit: 400000,
      });

      console.log("Simple Buy - Transaction submitted", transaction.hash());

      const receipt = await transaction.wait();
      console.log("Simple Buy - Transaction confirmed status", receipt.status);

      return { success: true };
    } catch (error) {
      console.error("SimpleBuy failed", error);
    }
  };

  const getProduct = async (id) => {
    try {
      if (!contract) return null;

      const product = await contract.products(id);
      const priceInWei = product.price;

      return {
        id: product.id.toNumber(),
        name: product.name,
        category: product.category,
        image: product.image,
        price: ethers.utils.formatEther(priceInWei),
        priceInWei: priceInWei,
        review: product.review.toNumber(),
        stock: product.stock.toNumber(),
      };
    } catch (error) {
      console.error("Error getting product", error);
    }
  };

  const getUserOrders = async () => {
    try {
      if (!contract || !account) return [];

      const ordersCount = await contract.ordersCount(account);
      const orders = [];

      for (let i = 1; i <= ordersCount; i++) {
        const order = await contract.orders(account, i);

        orders.push({
          id: i,
          orderTime: new Date(order.orderTime.toNumber() * 1000),
          product: {
            id: order.product.id.toNumber(),
            name: order.product.name,
            category: order.product.category,
            image: order.product.image,
            price: ethers.utils.formatEther(order.product.price),
            review: order.product.review.toNumber(),
            stock: order.product.review.toNumber(),
          },
        });
      }
      return orders;
    } catch (error) {
      console.error("Error getting orders", error);
      return [];
    }
  };

  const withdrawFunds = async () => {
    try {
      if (!contract || !isOwner) return false;

      const transaction = await contract.withdraw();
      await transaction.wait();
      return true;
    } catch (error) {
      console.error("Error withdrawing fund", error);
      return false;
    }
  };

  const value = {
    provider,
    account,
    contract,
    isOwner,
    loading,
    connectWallet,
    listProduct,
    simpleBuy,
    getProduct,
    getUserOrders,
    withdrawFunds
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export default Web3Provider;

export function useWeb3(){
    return useContext(Web3Context);
}
