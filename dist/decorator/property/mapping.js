"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Mapping(userSetting) {
    return function (targetClassPrototype, propertyKey) {
        if (!userSetting) {
            userSetting = {};
        }
        // If user does not set mappingKey, use original key to map.
        userSetting.mappingKey = userSetting.mappingKey || propertyKey;
        userSetting.nullable = userSetting.nullable || false;
        // init trasnfer object if it haven't.
        if (!targetClassPrototype.__MappingData__) {
            targetClassPrototype.__MappingData__ = {};
        }
        // save config.
        targetClassPrototype
            .__MappingData__[propertyKey] = userSetting;
    };
}
exports.Mapping = Mapping;
