interface MongoDoc {
    _createTime?: any;
    [propName: string]: any;
}


interface SocotraAPIResponse {
    error: number;
    msg?: string;
    [propName: string]: any;
}


interface SocotraRoute {
    path: string;
    controller: string;
    method?: SocotraRequestMethod;
    middlewares?: Array<string>;
    params?: SocotraRouteParams;
}


type SocotraRequestMethod = "GET" | "PUT" | "POST" | "DELETE";


interface SocotraRouteParams {
    [propName: string]: SocotraRouteParamsProp;
}

interface SocotraRouteParamsProp {
    type?: SocotraRequestParamType;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
}

type SocotraRequestParamType = "string" | "number" | "int" | "float" | "boolean" | "email";
