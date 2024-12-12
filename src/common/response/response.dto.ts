
class Response {
    private status: number;
    private body: any;
    private headers: { [key: string]: string };

    constructor(
        status: number,
        body: string,
        headers: { [key: string]: string }
    ) {
        this.status = status;
        this.body = body;
        this.headers = headers;
    }

    public getStatus(): number {
        return this.status;
    }

    public getBody(): string {
        return this.body;
    }

    public getHeaders(): { [key: string]: string } {
        return this.headers;
    }
}

export default Response;