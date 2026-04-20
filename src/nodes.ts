import { LANDING_REGEX, LOW_COST_REGEX, NODE_SUFFIX, countriesMeta } from "./config";
import type { ClashConfig, CountryInfoItem } from "./types";

const COUNTRY_REGEX_MAP = Object.fromEntries(
    Object.entries(countriesMeta).map(([country, meta]) => {
        return [country, new RegExp(meta.pattern.replace(/^\(\?i\)/, ""))];
    })
) as Record<string, RegExp>;

export function parseLowCost(config: ClashConfig): string[] {
    return (config.proxies || [])
        .filter((proxy) => LOW_COST_REGEX.test(proxy.name || ""))
        .map((proxy) => proxy.name)
        .filter((name): name is string => Boolean(name));
}

export function parseNodesByLanding(config: ClashConfig): {
    landingNodes: string[];
    nonLandingNodes: string[];
} {
    const landingNodes: string[] = [];
    const nonLandingNodes: string[] = [];

    for (const proxy of config.proxies || []) {
        const name = proxy.name;
        if (!name) continue;

        if (LANDING_REGEX.test(name)) {
            landingNodes.push(name);
            continue;
        }

        nonLandingNodes.push(name);
    }

    return { landingNodes, nonLandingNodes };
}

/**
 * 遍历订阅中的所有节点，按 `countriesMeta` 中定义的地区进行归类。
 */
export function parseCountries(config: ClashConfig): CountryInfoItem[] {
    const proxies = config.proxies || [];
    const countryNodes: Record<string, string[]> = Object.create(null);

    for (const proxy of proxies) {
        const name = proxy.name || "";

        if (LANDING_REGEX.test(name)) continue;
        if (LOW_COST_REGEX.test(name)) continue;

        for (const [country, regex] of Object.entries(COUNTRY_REGEX_MAP)) {
            if (!regex.test(name)) continue;

            if (!countryNodes[country]) {
                countryNodes[country] = [];
            }
            countryNodes[country].push(name);
            break;
        }
    }

    return Object.entries(countryNodes).map(([country, nodes]) => ({ country, nodes }));
}

export function getCountryGroupNames(countryInfo: CountryInfoItem[], minCount: number): string[] {
    const filtered = countryInfo.filter((item) => item.nodes.length >= minCount);

    filtered.sort((a, b) => {
        const wa = countriesMeta[a.country]?.weight ?? Infinity;
        const wb = countriesMeta[b.country]?.weight ?? Infinity;
        return wa - wb;
    });

    return filtered.map((item) => item.country + NODE_SUFFIX);
}

export function stripNodeSuffix(groupNames: string[]): string[] {
    const suffixPattern = new RegExp(`${NODE_SUFFIX}$`);
    return groupNames.map((name) => name.replace(suffixPattern, ""));
}
