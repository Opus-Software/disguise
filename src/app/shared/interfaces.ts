export interface Response {
    statusCode?: string;
    headers?: string[][];
    body?: string;
    wait?: string;
    decorate?: string;
    repeat?: string;
    shellTransform?: string;
    copy?: string;
    lookup?: string;
    bodyType?: string;
}

export interface Predicate {
    equals?: string;
    deepEquals?: string;
    contains?: string;
    startsWith?: string;
    endsWith?: string;
    matches?: string;
    exists?: string;
    not?: string;
    or?: string;
    and?: string;
    xpath?: string;
    jsonpath?: string;
    inject?: string;
    caseSensitive?: boolean;
}
