interface MongoDoc {
    _createTime?: any;
    [propName: string]: any;
}


interface SocotraResponse {
    error: number;
    msg?: string;
    [propName: string]: any;
}


interface SocotraRoute {
    path: string;
    controller: string;
    method?: string;
    middlewares?: Array<string>;
    params?: any;
}

interface SocotraRouteParams {
    [propName: string]: any;
}