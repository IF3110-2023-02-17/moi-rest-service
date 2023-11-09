import * as soap from "soap";
import { parseString } from "xml2js";

export class SoapClient {
    private client?: soap.Client;
    private soapUrl: string;

    constructor() {
        this.soapUrl = process.env.SOAP_SERVICE_URL as string;
        soap.createClientAsync(this.soapUrl)
            .then((client) => {
                this.client = client;
            })
            .catch((error) => {
                throw new Error(error);
            });
    }

    async rawMethod(reqArgs: any, method: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.client) {
                this.client[method](reqArgs, (err: any, result: any, rawResponse: any, soapHeader: any, rawRequest: any) => {
                    if (err) {
                        reject({ result, rawRequest, rawResponse, soapHeader, err });
                    } else {
                        resolve({ result, rawRequest, rawResponse, soapHeader, err });
                    }
                });
            }
        });
    }

    public getStatusCode(xml: string): Promise<any> {
        return new Promise((resolve, reject) => {
            parseString(xml, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    try {
                        resolve(result["S:Envelope"]["S:Body"][0]["S:Fault"][0]["detail"][0]["ns2:Exception"][0]["message"][0]);
                    } catch {
                        resolve("500");
                    }
                }
            });
        });
    }
}
