import Link from "next/link";
import { Component } from "react";
import { Button } from "semantic-ui-react";
import Layout from "../components/Layout";
import ProviderFactory from "../modules/ProviderFactory";

export default class Home extends Component {
  state = {
    isLoading: false,
    errorMessage: "",
    signer: undefined,
    connected: false,
    currentWallet: "",
    provider: undefined
  };

  connectWallet = async (choice: string) => {
    try {
      this.setState({ isLoading: true, errorMessage: "" });
      console.log(choice)
      const wallet = await ProviderFactory.createWalletFrom(choice)
      await wallet.connect()
      await wallet.sign('Sign In')
      this.setState({
        signer: wallet,
        loading: false,
        currentWallet: choice,
        isLoading: false,
      });
    } catch (err: any) {
      this.setState({
        signer: undefined,
        errorMessage: err.message,
        currentWallet: "",
        isLoading: false,
      });
      console.log(err.message);
    }
  };

  render() {
    return (
      <Layout>
        <h1>
          Status:{" "}
          {!!this.state.currentWallet
            ? `Connected to ${this.state.currentWallet}`
            : "Not Connected"}
        </h1>
        <Link href="/">
          <a>
            <Button
              content="Join With Metamask"
              color="orange"
              onClick={() => this.connectWallet('ethereum')}
              disabled={
                !!this.state.currentWallet &&
                this.state.currentWallet != "ethereum"
              }
            ></Button>
            <Button
              content="Join With Binance Smart Chain"
              color="yellow"
              onClick={() => this.connectWallet('BinanceChain')}
              disabled={
                !!this.state.currentWallet &&
                this.state.currentWallet != "BinanceChain"
              }
            ></Button>
          </a>
        </Link>
      </Layout>
    );
  }
}
