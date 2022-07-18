import ProviderHandler from "./Provider";
import UserWallet from "./UserWallet";
import detectEthereumProvider from "@metamask/detect-provider";

export default abstract class ProviderFactory {
    static readonly supportWallets = ["BinanceChain", "ethereum"];

    static async createWalletFrom(choice: string): Promise<UserWallet> {
        if (ProviderFactory.supportWallets.includes(choice)) {
            //   const api =
            //     choice === "ethereum"
            //       ? await this.getDefaultProvider()
            //       : eval(`window.${choice}`);
            const api = eval(`window.${choice}`)
            const providerHandler = new ProviderHandler(choice, api);
            return await new UserWallet(providerHandler);
        } else {
            return ProviderFactory.getDefaultProvider();
        }
    }

    private static async getDefaultProvider() {
        const provider = await detectEthereumProvider({
            mustBeMetaMask: true,
        });
        return await new UserWallet(new ProviderHandler("ethereum", provider));
    }
}
