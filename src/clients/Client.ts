import { SoapClient } from "./SoapClient";
import { MonoClient } from "./MonoClient";

export class Client {
    private soapClient: null | SoapClient;
    private monoClient: null | MonoClient;

    constructor() {
        this.soapClient = new SoapClient();
        this.monoClient = new MonoClient();
    }

    get soap() {
        if (this.soapClient) {
            return this.soapClient;
        }
        throw new Error();
    }

    get mono() {
        if (this.monoClient) {
            return this.monoClient;
        }
        throw new Error();
    }
}
