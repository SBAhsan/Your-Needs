import React from "react";
import { Link } from "react-router-dom";
import { useWeb3 } from "../../contexts/Web3Context";
import "./Navbar.css"

const NavBar = () => {
  const { account, isOwner, connectWallet } = useWeb3();

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to={"/"}>Your Needs</Link>
      </div>
      <div className="nav-menu">
        <Link to={"/"} className="nav-item">Home</Link>
        {account && <Link to={"/my-orders"} className="nav-item">My Orders</Link>}
        {isOwner && <Link to={"/admin"} className="nav-item">Admin</Link>}
      </div>
      <div>
        {!account ? (
          <button onClick={connectWallet} className="btn-connect">
            Connect Wallet
          </button>
        ) : (
          <div className="account-info">{`${account.substring(0, 6)}...${
            account.substring(account.length - 4)
          }`}</div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
