const request = require('request');

interface RequestServiceResponse {
    error: any;
    response: any;
    body: any;
}


export class RequestService {
    get(url: string): Promise<RequestServiceResponse> {
        return new Promise(resolve => {
            request(url, (error, response, body) => {
                resolve({
                    error: error,
                    response: response,
                    body: body
                });
            });
        });
    }
}