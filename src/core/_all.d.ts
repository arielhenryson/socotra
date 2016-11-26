interface MongoDoc {
    _createTime?: any;
    [propName: string]: any;
}

interface SocotraResponse {
    error: number;
    msg?: string;
    [propName: string]: any
}