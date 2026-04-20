/*
powerfullz 的 Substore 订阅转换脚本
https://github.com/powerfullz/override-rules

源码说明：
- 源码已迁移至 `src/*.ts`
- 由 CI 编译输出根目录 `convert.js`，再压缩为 `convert.min.js`
*/

import {
    CDN_URL,
    FAKE_IP_FILTER,
    geoxURL,
    PROXY_GROUPS,
    ruleProviders,
    snifferConfig,
} from "./config";
import { buildFeatureFlags } from "./flags";
import { buildCountryProxyGroups, buildProxyGroups } from "./groups";
import {
    getCountryGroupNames,
    parseCountries,
    parseLowCost,
    parseNodesByLanding,
    stripNodeSuffix,
} from "./nodes";
import { buildDnsConfig, buildRules } from "./rules";
import { buildBaseLists } from "./selectors";
import type { ClashConfig, ScriptArgs } from "./types";

declare const $arguments: ScriptArgs;

function getRawArgs(): ScriptArgs {
    try {
        return $arguments;
    } catch {
        console.log("[powerfullz 的覆写脚本] 未检测到传入参数，使用默认参数。", {});
        return {};
    }
}

const rawArgs = getRawArgs();
const {
    loadBalance,
    landing,
    ipv6Enabled,
    fullConfig,
    keepAliveEnabled,
    fakeIPEnabled,
    quicEnabled,
    regexFilter,
    countryThreshold,
} = buildFeatureFlags(rawArgs);

// eslint-disable-next-line no-unused-vars -- 通过 vm.runInContext 在 yaml_generator 中被调用
function main(config: ClashConfig): ClashConfig {
    const resultConfig: ClashConfig = { proxies: config.proxies };

    const countryInfo = parseCountries(resultConfig);
    const lowCostNodes = parseLowCost(resultConfig);
    const countryGroupNames = getCountryGroupNames(countryInfo, countryThreshold);
    const countries = stripNodeSuffix(countryGroupNames);

    const { landingNodes, nonLandingNodes } = landing
        ? parseNodesByLanding(resultConfig)
        : { landingNodes: [], nonLandingNodes: [] };

    const {
        defaultProxies,
        defaultProxiesDirect,
        defaultSelector,
        defaultFallback,
        frontProxySelector,
    } = buildBaseLists({
        landing,
        lowCostNodes,
        countryGroupNames,
        nonLandingNodes,
        regexFilter,
    });

    const countryProxyGroups = buildCountryProxyGroups({
        countries,
        landing,
        loadBalance,
        regexFilter,
        countryInfo,
    });

    const proxyGroups = buildProxyGroups({
        landing,
        regexFilter,
        countries,
        countryProxyGroups,
        lowCostNodes,
        landingNodes,
        defaultProxies,
        defaultProxiesDirect,
        defaultSelector,
        defaultFallback,
        frontProxySelector,
    });

    const globalProxies = proxyGroups.map((item) => String(item.name));
    proxyGroups.push({
        name: PROXY_GROUPS.GLOBAL,
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Global.png`,
        "include-all": true,
        type: "select",
        proxies: globalProxies,
    });

    const finalRules = buildRules({ quicEnabled });

    if (fullConfig) {
        Object.assign(resultConfig, {
            "mixed-port": 7890,
            "redir-port": 7892,
            "tproxy-port": 7893,
            "routing-mark": 7894,
            "allow-lan": true,
            "bind-address": "*",
            ipv6: ipv6Enabled,
            mode: "rule",
            "unified-delay": true,
            "tcp-concurrent": true,
            "find-process-mode": "off",
            "log-level": "info",
            "geodata-loader": "standard",
            "external-controller": ":9999",
            "disable-keep-alive": !keepAliveEnabled,
            profile: {
                "store-selected": true,
            },
        });
    }

    const dnsConfig = buildDnsConfig({
        mode: "redir-host",
        ipv6Enabled,
    });
    const dnsConfigFakeIp = buildDnsConfig({
        mode: "fake-ip",
        ipv6Enabled,
        fakeIpFilter: FAKE_IP_FILTER,
    });

    Object.assign(resultConfig, {
        "proxy-groups": proxyGroups,
        "rule-providers": ruleProviders,
        rules: finalRules,
        sniffer: snifferConfig,
        dns: fakeIPEnabled ? dnsConfigFakeIp : dnsConfig,
        "geodata-mode": true,
        "geox-url": geoxURL,
    });

    return resultConfig;
}

(globalThis as Record<string, unknown>).main = main;
