import * as soap from "soap";

export class SoapClient {
    private client?: soap.Client;
    private soapUrl: string;

    constructor() {
        this.soapUrl = process.env.SOAP_SERVICE_URL as string;
        soap.createClientAsync(this.soapUrl)
            .then((client) => {
                this.client = client;
                this.client.addHttpHeader("Api-Key", process.env.SOAP_API_KEY);
            })
            .catch((error) => {
                // throw new Error(error);
            });
    }

    async invoke(reqArgs: any, method: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.client) {
                this.client[method](
                    reqArgs,
                    (
                        err: any,
                        result: any,
                        rawResponse: any,
                        soapHeader: any,
                        rawRequest: any
                    ) => {
                        if (err) {
                            reject(
                                JSON.parse(
                                    err.root.Envelope.Body.Fault.faultstring
                                )
                            );
                        } else {
                            resolve(result);
                        }
                    }
                );
            }
        });
    }
}
