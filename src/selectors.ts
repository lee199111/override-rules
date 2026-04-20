import { PROXY_GROUPS } from "./config";
import type { BaseLists, BuildBaseListsInput } from "./types";

/**
 * 接受任意数量的元素（包括嵌套数组），展平后过滤掉所有假值（false、null、undefined 等）。
 */
export const buildList = <T>(...elements: Array<T | T[] | false | null | undefined>): T[] => {
    return elements.flat().filter(Boolean) as T[];
};

export function buildBaseLists({
    landing,
    lowCostNodes,
    countryGroupNames,
    nonLandingNodes,
    regexFilter,
}: BuildBaseListsInput): BaseLists {
    const lowCost = lowCostNodes.length > 0 || regexFilter;

    const defaultSelector = buildList(
        PROXY_GROUPS.AUTO,
        PROXY_GROUPS.FALLBACK,
        landing && PROXY_GROUPS.LANDING,
        countryGroupNames,
        lowCost && PROXY_GROUPS.LOW_COST,
        PROXY_GROUPS.MANUAL,
        "DIRECT"
    );

    const defaultProxies = buildList(
        PROXY_GROUPS.SELECT,
        landing && PROXY_GROUPS.LANDING,
        countryGroupNames,
        lowCost && PROXY_GROUPS.LOW_COST,
        PROXY_GROUPS.MANUAL,
        PROXY_GROUPS.DIRECT
    );

    const defaultProxiesDirect = buildList(
        PROXY_GROUPS.DIRECT,
        landing && PROXY_GROUPS.LANDING,
        countryGroupNames,
        lowCost && PROXY_GROUPS.LOW_COST,
        PROXY_GROUPS.SELECT,
        PROXY_GROUPS.MANUAL
    );

    const defaultFallback = buildList(
        landing && PROXY_GROUPS.LANDING,
        countryGroupNames,
        lowCost && PROXY_GROUPS.LOW_COST,
        PROXY_GROUPS.MANUAL,
        "DIRECT"
    );

    const frontProxySelector = buildList(
        countryGroupNames,
        "DIRECT",
        !regexFilter && nonLandingNodes
    );

    return {
        defaultProxies,
        defaultProxiesDirect,
        defaultSelector,
        defaultFallback,
        frontProxySelector,
    };
}
