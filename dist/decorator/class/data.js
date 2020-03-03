"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
function initValue(defaultValue, mapConfig, originalKey, dataValue) {
    if (dataValue === null || dataValue === undefined) {
        if (mapConfig.nullable) {
            return dataValue;
        }
        if (Array.isArray(defaultValue)) {
            return [];
        }
        return defaultValue;
    }
    if (typeof dataValue !== typeof defaultValue) {
        throw Error("The type of Property: " + originalKey + " in mapped data and model do not match.");
    }
    // not Array or object
    if (typeof dataValue !== 'object') {
        return dataValue;
    }
    // Array
    if (Array.isArray(defaultValue)) {
        var typeRef_1 = defaultValue[0];
        if (!typeRef_1) {
            throw Error("The default value type of " + originalKey + " is Array, it must pass at least 1 element for type mapping.");
        }
        if (typeof typeRef_1 === 'object') {
            return dataValue.map(function (itr) { return new typeRef_1.constructor(itr); });
        }
        return dataValue.map(function (itr) { return itr; });
    }
    // object
    return new defaultValue.constructor(dataValue);
}
function parseToData(value) {
    if (value.__MappingData__ && typeof value.toData === 'function') {
        return value.toData();
    }
    if (Array.isArray(value)) {
        return value.map(function (itr) {
            return parseToData(itr);
        });
    }
    if (typeof value === 'object') {
        return JSON.parse(JSON.stringify(value));
    }
    return value;
}
function toData() {
    var mappingList = this.__MappingData__;
    var keys = Object.keys(mappingList);
    var output = {};
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var mappingConfig = mappingList[key];
        output[mappingConfig.mappingKey] = parseToData(this[key]);
    }
    return output;
}
function Data(originalC) {
    // save a reference to the original constructor
    var newConstructor = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length !== 1) {
            console.warn("The arguments of @Data model are not one. If the mapping data is not the first args, the program will be something wrong.");
        }
        var inputData = args[0];
        var c = new (originalC.bind.apply(originalC, __spreadArrays([void 0], args)))();
        var mappingList = c.__MappingData__;
        var keys = [];
        try {
            keys = Object.keys(mappingList);
        }
        catch (e) {
            throw Error("There is no mapping data in " + originalC.name + ". Please remove @Data on class " + originalC.name + " or add @Mapping on its properties.");
        }
        for (var _a = 0, keys_2 = keys; _a < keys_2.length; _a++) {
            var key = keys_2[_a];
            var mappingConfig = mappingList[key];
            c[key] = initValue(c[key], mappingConfig, key, inputData[mappingConfig.mappingKey]);
        }
        c.toData = toData.bind(c);
        return c;
    };
    newConstructor.prototype = originalC.prototype;
    newConstructor.prototype.constructor = newConstructor;
    return newConstructor;
}
exports.Data = Data;
