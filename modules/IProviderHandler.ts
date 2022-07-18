import { ethers } from "ethers"

export type ConnectInfo = {
    chainId: string
}

export type ProviderMessage = {
    type: string
    data: unknown
}

export type RequestArguments = {
    method: string
    params?: unknown[] | object
}




export interface IProviderHandler {
    name: string
    provider: ethers.providers.Web3Provider
    handleConnect(connectInfo?: ConnectInfo): Promise<void>
    handleDisconnect(): Promise<void>
    handleChainChanged(_chainId: string): Promise<void>
    handleMessage(message: ProviderMessage): Promise<void>
    handleAccountsChanged(accounts: String[]): Promise<void>
}


