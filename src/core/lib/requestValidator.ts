export class RequestValidator {
    values


    testParams(paramsSchema, values) {
        this.values = values

        for (let i in paramsSchema) {
            const param = paramsSchema[i]


            if (this.isMissingRequired(i, param)) {
                return {
                    error: 1,
                    msg: 'Missing required value ' + i
                }
            }


            if (this.isMoreThenMaxChar(i, param)) {
                return {
                    error: 2,
                    msg: i + ' value length is more then maxLength ' + param.maxLength
                }
            }

            if (this.isLessThenMinChar(i, param)) {
                return {
                    error: 3,
                    msg: i + ' value length is less then minLength ' + param.minLength
                }
            }
        }


        return {
            error: 0
        }
    }


    formatType(val, attrs) {
        if (typeof attrs.type !== 'undefined') {
            switch (attrs.type) {
                case 'string':
                    return String(val)
                case 'number':
                    return Number(val)
                case 'int':
                    return parseInt(val)
                case 'float':
                    return parseFloat(val)
                case 'boolean':
                    return val
                case 'email':
                    return val
                default:
                    return val
            }
        }
    }


    isValidType(val, paramsSchema) {
        try {
            if (typeof paramsSchema.type === 'undefined') return true

            const type = paramsSchema.type

            switch (type) {
                case 'string':
                    return typeof val === 'string'
                case 'number':
                    return typeof val === 'number'
                case 'int':
                    return typeof val === 'number'
                case 'float':
                    return typeof val === 'number'
                case 'boolean':
                    return typeof val === 'boolean'
                case 'email':
                    return RequestValidator.validateEmail(val)
                default:
                    return true
            }
        } catch (e) {
            return true
        }

    }


    toLowerCaseIfSet(key, attrs) {
        if (typeof attrs.toLowerCase !== 'undefined' && attrs.toLowerCase) {
            return this.values[key].toLocaleLowerCase()
        }

        return this.values[key]
    }


    toUpperCaseIfSet(key, attrs) {
        if (typeof attrs.toUpperCase !== 'undefined' && attrs.toUpperCase) {
            return this.values[key].toLocaleUpperCase()
        }

        return this.values[key]
    }


    static validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)
    }


    private isMoreThenMaxChar(key, attrs) {
        return typeof attrs.maxLength !== 'undefined' && this.values[key].length > attrs.maxLength
    }


    private isLessThenMinChar(key, attrs) {
        return typeof attrs.minLength !== 'undefined' && this.values[key].length < attrs.minLength
    }


    private isMissingRequired(key, attrs) {
        return attrs.required && typeof this.values[key] === 'undefined'
    }
}
