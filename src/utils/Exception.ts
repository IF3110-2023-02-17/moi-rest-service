import { HttpStatus } from "./HttpStatus";

export class Exception extends Error {
    readonly status: HttpStatus;

    constructor(message: string, status: HttpStatus) {
        super(message);
        this.status = status;
    }
}
