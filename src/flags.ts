import { FEATURE_FLAG_DEFAULTS } from "./config";
import type { FeatureFlags, ScriptArgs } from "./types";

type FlagSpec = Record<string, keyof Omit<FeatureFlags, "countryThreshold">>;

export function parseBool(value: unknown): boolean {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
        return value.toLowerCase() === "true" || value === "1";
    }
    return false;
}

export function parseNumber(value: unknown, defaultValue = 0): number {
    if (value === null || typeof value === "undefined") {
        return defaultValue;
    }

    const num = parseInt(String(value), 10);
    return Number.isNaN(num) ? defaultValue : num;
}

/**
 * 解析传入的脚本参数，并将其转换为内部使用的功能开关（feature flags）。
 */
export function buildFeatureFlags(args: ScriptArgs): FeatureFlags {
    const spec: FlagSpec = {
        loadbalance: "loadBalance",
        landing: "landing",
        ipv6: "ipv6Enabled",
        full: "fullConfig",
        keepalive: "keepAliveEnabled",
        fakeip: "fakeIPEnabled",
        quic: "quicEnabled",
        regex: "regexFilter",
    };

    const flags: FeatureFlags = {
        ...FEATURE_FLAG_DEFAULTS,
        countryThreshold: 0,
    };

    for (const [sourceKey, targetKey] of Object.entries(spec)) {
        const rawValue = args[sourceKey];
        if (rawValue === null || typeof rawValue === "undefined") {
            flags[targetKey] = FEATURE_FLAG_DEFAULTS[targetKey];
        } else {
            flags[targetKey] = parseBool(rawValue);
        }
    }

    flags.countryThreshold = parseNumber(args.threshold, 0);
    return flags;
}
