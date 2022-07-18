import { ethers } from "ethers";
import { IProviderHandler } from "./IProviderHandler";

export default class UserWallet {
    providerHandler!: IProviderHandler
    _signer!: ethers.Signer;
    constructor(_providerHandler: IProviderHandler) {
        this.setProviderHandler(_providerHandler)
    }

    setProviderHandler(_providerHandler: IProviderHandler): void {
        this.providerHandler = _providerHandler
        this._signer = this.providerHandler.provider.getSigner()
    }

    get signer() {
        return this._signer
    }

    get provider() {
        return this.providerHandler.provider;
    }

    async connect() {
        await this.providerHandler.handleConnect()
    }
    async sign(command: string) {
        const nonce = Math.floor(Math.random() * (9999 - 1000) + 1000)
        const messageHash = ethers.utils.id(`${command} with OTP: ${nonce}`)
        const messageHashBytes = ethers.utils.arrayify(messageHash)
        const flatSig = await this._signer.signMessage(messageHashBytes)
        console.log(flatSig)
    }


}