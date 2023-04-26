import { Inject, Service } from "typedi";

@Service()
export class SwapService {
    private readonly swapRouterAddresses: string[];

    constructor(@Inject("swapRouterAddresses") swapRouterAddresses: string) {
       this.swapRouterAddresses = swapRouterAddresses.toLocaleLowerCase().trim().split(',');
    }

    isSwapTransaction(toAddress: string | null): boolean{
        return toAddress !== null && this.swapRouterAddresses.indexOf(toAddress.toLowerCase()) > -1;
    }
}