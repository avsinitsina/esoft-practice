class Validator {
    constructor() {
        this._errors = [];
    }

    get Errors() {
        return this._errors;
    }

    types = ["number", "string", "boolean", "object", "array"];

    isValidInEnum(schema = {}, dataToValidate, errors) {
        if(schema.enum !== undefined ) {
            if(schema.type === "array") {
                let found = schema.enum.find(x => {
                    return JSON.stringify(x) === JSON.stringify(dataToValidate);
                });
                if(found === undefined) {
                    errors.push("The enum does not support one of array elements");
                    return false;
                }
            }
            else if (!schema.enum.includes(dataToValidate)){
                errors.push("The enum does not support value");
                return false;
            }
        }
        return true;
    }

    isValidObject(schema = {}, dataToValidate, errors){
        if(dataToValidate !== null) {
            const properties = Object.keys(dataToValidate);
            if(schema.minProperties > properties.length) {
                errors.push("Too few properties in object");
                return false;
            }
            if(schema.maxProperties < properties.length) {
                errors.push("Too many properties in object");
                return false;
            }
            if(schema.required !== undefined) {
                let hasRequired = true;
                schema.required.forEach(x => {
                    if(!properties.includes(x)) {
                        errors.push("Property required, but value is undefined")
                        hasRequired = false;
                    }
                })
                return hasRequired;
            }
            if(schema.properties !== undefined) {
                let propertiesKeys = Object.keys(schema.properties);
                if(schema.additionalProperties === false) {                    
                    let hasAdditional = false;
                    properties.forEach(x => {
                        if(!propertiesKeys.includes(x)) {
                            errors.push("An object cant have additional properties");
                            hasAdditional = true;
                        }
                    });
                    return !hasAdditional;    
                }
                let isIncorrect = false;
                propertiesKeys.forEach(x => {
                    if(!this._isValid(schema.properties[x], dataToValidate[x], [])) {
                        errors.push("Type is incorrect");
                        isIncorrect = true;
                    }
                });
                return !isIncorrect;
            }
            
        }

        return true;
    }

    isValidArray(schema = {}, dataToValidate, errors) {
        if(schema.minItems > dataToValidate?.length) {
            errors.push("Items count less than can be");
            return false;
        }
        if(schema.maxItems < dataToValidate?.length) {
            errors.push("Items count more than can be");
            return false;
        }
        if(schema.items !== undefined) {
            let hasIncorrect = false;
            if(!Array.isArray(schema.items)) {
                dataToValidate.forEach(x => {
                    if(typeof x !== schema.items.type) {
                        errors.push("Type is incorrect");
                        hasIncorrect = true;
                    }
                })
            }
            else {
                hasIncorrect = true;                
                for(let i = 0; i < dataToValidate.length; i++) {
                    schema.items.forEach(x => {
                        if(typeof dataToValidate[i] === x.type) {
                            hasIncorrect = false;
                        }
                    })
                }
                
            }
            return !hasIncorrect;
        }
        if(schema.contains !== undefined) {
            if(!dataToValidate.includes(schema.contains)) {
                errors.push("Must contain a value, but does not");
                return false;
            }            
        }
        if(schema.uniqueItems === true) {
            let second = [];
            let onlyUnique = true;
            dataToValidate.forEach(x => {
                if(second.includes(JSON.stringify(x))) {
                    errors.push("Elements of array not unique");
                    onlyUnique = false;
                }
                else {
                    second.push(JSON.stringify(x));
                }                
            });
            return onlyUnique;
        }
        return true;
    }

    isValidString(schema = {}, dataToValidate, errors) {
        if(schema.minLength > dataToValidate?.length) {
            errors.push("Too short string");
            return false;
        }
        if(schema.maxLength < dataToValidate?.length) {
            errors.push("Too long string");
            return false;
        }
        if(schema.pattern !== undefined && !schema.pattern.test(dataToValidate)) {
            errors.push("String does not match pattern")
            return false;
        }
        if(schema.format !== undefined) {
            const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            const dateRegex = /^\d{4}([\/\-])(0?[1-9]|1[012])\1(0?[1-9]|[12][0-9]|3[01])$/
            if(schema.format === "email") {
                if(!emailRegex.test(dataToValidate)) {
                    errors.push("Format of string is not valid")
                    return false;
                }
            }
            else if(schema.format === "date") {
                if(!dateRegex.test(dataToValidate)) {
                    errors.push("Format of string is not valid")
                    return false;
                }
            }

        }
        return true;
    }

    isValidNumber(schema = {}, dataToValidate, errors) {
        if(schema.minimum > dataToValidate) {
            errors.push("Value is less than it can be");
            return false;
        }
        if(schema.maximum < dataToValidate) {
            errors.push("Value is greater than it can be");
            return false;
        }
        return true;
    }

    isValidOne(schema = {}, dataToValidate, errors) {
        if(!this.types.includes(schema.type)) {
            errors.push("Unknown type");
            return false;
        }

        if(dataToValidate === null) {
            if(!schema.nullable) {
                errors.push("Value is null, but nullable false");
                return false;
            }
        }
        else {
            if(dataToValidate.constructor.name.toLowerCase() !== schema.type) {
                errors.push("Type is incorrect");
                return false;
            }
        }

        switch(schema.type) {
            case "number": return this.isValidNumber(schema, dataToValidate, errors) && this.isValidInEnum(schema, dataToValidate, errors);
            case "string": return this.isValidString(schema, dataToValidate, errors) && this.isValidInEnum(schema, dataToValidate, errors);
            case "array" : return this.isValidArray(schema, dataToValidate, errors) && this.isValidInEnum(schema, dataToValidate, errors);
            case "object": return this.isValidObject(schema, dataToValidate, errors);
        }
        return true;
    }

    /**
     *
     * @param schema
     * @param dataToValidate
     * @returns {boolean}
     */
    _isValid(schema = {}, dataToValidate, errors) {
        if(schema.oneOf !== undefined) {
            let countValid = 0;
            schema.oneOf.forEach(x => {
                if(countValid > 1 || this.isValidOne(x, dataToValidate, [])) {
                    countValid++;
                }
            });
            if(countValid === 0) {
                errors.push("None schemas are valid");
            }
            else if(countValid > 1) {
                errors.push("More than one shema valid for this data")
            }
            
            return countValid === 1;
        }
        else if(schema.anyOf !== undefined) {
            let hasValid = false;
            schema.anyOf.forEach(x => {
                if(hasValid || this.isValidOne(x, dataToValidate, [])) {
                    hasValid = true;
                }
            });
            if(!hasValid) {
                errors.push("None schemas are valid");
            }
            return hasValid;
        } 
        else {
            return this.isValidOne(schema, dataToValidate, errors);
        }
    }
    isValid(schema = {}, dataToValidate) {
        return this._isValid(schema, dataToValidate, this._errors)
    }
}

export default Validator;