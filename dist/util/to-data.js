"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseToData(value) {
    if (value.__MappingData__) {
        return toData(value);
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
function toData(data) {
    var mappingList = data.__MappingData__;
    if (mappingList) {
        var keys = Object.keys(mappingList);
        var output = {};
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var mappingConfig = mappingList[key];
            output[mappingConfig.mappingKey] = parseToData(data[key]);
        }
        return output;
    }
    else {
        return JSON.parse(JSON.stringify(data));
    }
}
exports.toData = toData;
