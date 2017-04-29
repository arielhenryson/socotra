export class RequestValidator {
    values;


    testParams(paramsSchema, values) {
        this.values = values;

        for (let i in paramsSchema) {
            const param = paramsSchema[i];



            // check for required value
            if (this.isMissingRequired(i, param)) {
                return {
                    error: 1,
                    msg: "Missing required value " + i
                };
            }

        }


        return {
            error: 0
        };
    }


    private isMissingRequired(key, attrs) {
        return attrs.required && typeof this.values[key] === "undefined";
    }


    private isCorrectType() {

    }


    private isMoreThenMaxChar() {}


    private isLessThenMinChar() {

    }
}