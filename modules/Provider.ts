import { ethers } from "ethers";
import { IProviderHandler, ProviderMessage, ConnectInfo } from "./IProviderHandler";

export default class ProviderHandler implements IProviderHandler {
    name: string
    provider: ethers.providers.Web3Provider;

    constructor(name: string, _provider: any) {
        this.name = name
        _provider.on("message", this.handleMessage);
        _provider.on("connect", this.handleConnect);
        _provider.on("disconnect", () => console.log('im disconnecting'));
        _provider.on("chainChanged", this.handleChainChanged);
        _provider.on("accountsChanged", this.handleAccountsChanged);
        console.log(_provider)
        this.provider = new ethers.providers.Web3Provider(_provider)
        console.log(this.provider)

    }
    async handleConnect(connectInfo?: ConnectInfo): Promise<void> {
        await this.provider.send('eth_requestAccounts', [])
    }
    async handleMessage(message: ProviderMessage): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async handleDisconnect(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async handleChainChanged(_chainId: string): Promise<void> {
        window.location.reload();
    }
    async handleAccountsChanged(accounts: String[]): Promise<void> {
        window.location.reload();
    }
}
