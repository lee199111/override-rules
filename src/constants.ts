import type { CountryMeta } from "./types";

export const NODE_SUFFIX = "节点";
export const CDN_URL = "https://cdn.jsdelivr.net";

/**
 * `LANDING_PATTERN` 与 `LANDING_REGEX` 描述同一规则，但格式不同：
 * - `LANDING_REGEX`：JS `RegExp` 对象，供脚本内部过滤节点时使用（用 `/i` flag 表示不区分大小写）。
 * - `LANDING_PATTERN`：字符串，写入 YAML 的 `filter` / `exclude-filter` 字段，
 *   其中 `(?i)` 前缀是 Clash/Mihomo 的不区分大小写语法。
 */
export const LOW_COST_FILTER = "0\\.[0-5]|低倍率|省流|实验性";
export const LOW_COST_GROUP_PATTERN = "(?i)0\\.[0-5]|低倍率|省流|实验性";
export const LOW_COST_REGEX = new RegExp(LOW_COST_FILTER, "i");
export const LANDING_REGEX = /家宽|家庭宽带|商宽|商业宽带|星链|Starlink|落地/i;
export const LANDING_PATTERN = "(?i)家宽|家庭宽带|商宽|商业宽带|星链|Starlink|落地";

export const FEATURE_FLAG_DEFAULTS = {
    loadBalance: false,
    landing: false,
    ipv6Enabled: false,
    fullConfig: false,
    keepAliveEnabled: false,
    fakeIPEnabled: true,
    quicEnabled: false,
    regexFilter: false,
} as const;

export const PROXY_GROUPS = {
    SELECT: "选择代理",
    MANUAL: "手动选择",
    AUTO: "自动选择",
    FALLBACK: "故障转移",
    DIRECT: "直连",
    LANDING: "落地节点",
    LOW_COST: "低倍率节点",
    FRONT_PROXY: "前置代理",
    STATIC_RESOURCES: "静态资源",
    AI_SERVICE: "AI服务",
    CRYPTO: "加密货币",
    APPLE: "苹果服务",
    GOOGLE: "谷歌服务",
    MICROSOFT: "微软服务",
    BILIBILI: "哔哩哔哩",
    BAHAMUT: "巴哈姆特",
    YOUTUBE: "YouTube",
    NETFLIX: "Netflix",
    TIKTOK: "TikTok",
    SPOTIFY: "Spotify",
    EHENTAI: "E-Hentai",
    TELEGRAM: "Telegram",
    TRUTH_SOCIAL: "真相社交",
    PIKPAK: "PikPak网盘",
    SSH: "SSH(22端口)",
    SOGOU_INPUT: "搜狗输入法",
    AD_BLOCK: "广告拦截",
    GLOBAL: "GLOBAL",
} as const;

export const ruleProviders = {
    ADBlock: {
        type: "http",
        behavior: "domain",
        format: "mrs",
        interval: 86400,
        url: `${CDN_URL}/gh/217heidai/adblockfilters@main/rules/adblockmihomolite.mrs`,
        path: "./ruleset/ADBlock.mrs",
    },
    SogouInput: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: "https://ruleset.skk.moe/Clash/non_ip/sogouinput.txt",
        path: "./ruleset/SogouInput.txt",
    },
    StaticResources: {
        type: "http",
        behavior: "domain",
        format: "text",
        interval: 86400,
        url: "https://ruleset.skk.moe/Clash/domainset/cdn.txt",
        path: "./ruleset/StaticResources.txt",
    },
    CDNResources: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: "https://ruleset.skk.moe/Clash/non_ip/cdn.txt",
        path: "./ruleset/CDNResources.txt",
    },
    TikTok: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/TikTok.list`,
        path: "./ruleset/TikTok.list",
    },
    EHentai: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/EHentai.list`,
        path: "./ruleset/EHentai.list",
    },
    SteamFix: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/SteamFix.list`,
        path: "./ruleset/SteamFix.list",
    },
    GoogleFCM: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/FirebaseCloudMessaging.list`,
        path: "./ruleset/FirebaseCloudMessaging.list",
    },
    AdditionalFilter: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/AdditionalFilter.list`,
        path: "./ruleset/AdditionalFilter.list",
    },
    AdditionalCDNResources: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/AdditionalCDNResources.list`,
        path: "./ruleset/AdditionalCDNResources.list",
    },
    Crypto: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/Crypto.list`,
        path: "./ruleset/Crypto.list",
    },
};

export const baseRules = [
    `RULE-SET,ADBlock,${PROXY_GROUPS.AD_BLOCK}`,
    `RULE-SET,AdditionalFilter,${PROXY_GROUPS.AD_BLOCK}`,
    `RULE-SET,SogouInput,${PROXY_GROUPS.SOGOU_INPUT}`,
    `DOMAIN-SUFFIX,truthsocial.com,${PROXY_GROUPS.TRUTH_SOCIAL}`,
    `RULE-SET,StaticResources,${PROXY_GROUPS.STATIC_RESOURCES}`,
    `RULE-SET,CDNResources,${PROXY_GROUPS.STATIC_RESOURCES}`,
    `RULE-SET,AdditionalCDNResources,${PROXY_GROUPS.STATIC_RESOURCES}`,
    `RULE-SET,Crypto,${PROXY_GROUPS.CRYPTO}`,
    `RULE-SET,EHentai,${PROXY_GROUPS.EHENTAI}`,
    `RULE-SET,TikTok,${PROXY_GROUPS.TIKTOK}`,
    `RULE-SET,SteamFix,${PROXY_GROUPS.DIRECT}`,
    `RULE-SET,GoogleFCM,${PROXY_GROUPS.DIRECT}`,
    `GEOSITE,YOUTUBE,${PROXY_GROUPS.YOUTUBE}`,
    `GEOSITE,TELEGRAM,${PROXY_GROUPS.TELEGRAM}`,
    `GEOSITE,CATEGORY-AI-!CN,${PROXY_GROUPS.AI_SERVICE}`,
    `GEOSITE,GOOGLE-PLAY@CN,${PROXY_GROUPS.DIRECT}`,
    `GEOSITE,MICROSOFT@CN,${PROXY_GROUPS.DIRECT}`,
    `GEOSITE,APPLE,${PROXY_GROUPS.APPLE}`,
    `GEOSITE,MICROSOFT,${PROXY_GROUPS.MICROSOFT}`,
    `GEOSITE,GOOGLE,${PROXY_GROUPS.GOOGLE}`,
    `GEOSITE,NETFLIX,${PROXY_GROUPS.NETFLIX}`,
    `GEOSITE,SPOTIFY,${PROXY_GROUPS.SPOTIFY}`,
    `GEOSITE,BAHAMUT,${PROXY_GROUPS.BAHAMUT}`,
    `GEOSITE,BILIBILI,${PROXY_GROUPS.BILIBILI}`,
    `GEOSITE,PIKPAK,${PROXY_GROUPS.PIKPAK}`,
    `GEOSITE,GFW,${PROXY_GROUPS.SELECT}`,
    `GEOSITE,CN,${PROXY_GROUPS.DIRECT}`,
    `GEOSITE,PRIVATE,${PROXY_GROUPS.DIRECT}`,
    `GEOIP,NETFLIX,${PROXY_GROUPS.NETFLIX},no-resolve`,
    `GEOIP,TELEGRAM,${PROXY_GROUPS.TELEGRAM},no-resolve`,
    `GEOIP,CN,${PROXY_GROUPS.DIRECT}`,
    `GEOIP,PRIVATE,${PROXY_GROUPS.DIRECT}`,
    `DST-PORT,22,${PROXY_GROUPS.SSH}`,
    `MATCH,${PROXY_GROUPS.SELECT}`,
];

export const snifferConfig = {
    sniff: {
        TLS: {
            ports: [443, 8443],
        },
        HTTP: {
            ports: [80, 8080, 8880],
        },
        QUIC: {
            ports: [443, 8443],
        },
    },
    "override-destination": false,
    enable: true,
    "force-dns-mapping": true,
    "skip-domain": ["Mijia Cloud", "dlg.io.mi.com", "+.push.apple.com"],
};

export const FAKE_IP_FILTER = [
    "geosite:private",
    "geosite:connectivity-check",
    "geosite:cn",
    "Mijia Cloud",
    "dig.io.mi.com",
    "localhost.ptlogin2.qq.com",
    "*.icloud.com",
    "*.stun.*.*",
    "*.stun.*.*.*",
];

export const geoxURL = {
    geoip: `${CDN_URL}/gh/Loyalsoldier/v2ray-rules-dat@release/geoip.dat`,
    geosite: `${CDN_URL}/gh/Loyalsoldier/v2ray-rules-dat@release/geosite.dat`,
    mmdb: `${CDN_URL}/gh/Loyalsoldier/geoip@release/Country.mmdb`,
    asn: `${CDN_URL}/gh/Loyalsoldier/geoip@release/GeoLite2-ASN.mmdb`,
};

/**
 * 各地区的元数据：`weight` 决定在代理组列表中的排列顺序（值越小越靠前，未设置则排末尾）；
 * `pattern` 是用于匹配节点名称的正则字符串；`icon` 为策略组图标 URL。
 */
export const countriesMeta: Record<string, CountryMeta> = {
    香港: {
        weight: 10,
        pattern: "香港|港|HK|hk|Hong Kong|HongKong|hongkong|🇭🇰",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png`,
    },
    澳门: {
        pattern: "澳门|MO|Macau|🇲🇴",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Macao.png`,
    },
    台湾: {
        weight: 20,
        pattern: "台|新北|彰化|TW|Taiwan|🇹🇼",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png`,
    },
    新加坡: {
        weight: 30,
        pattern: "新加坡|坡|狮城|SG|Singapore|🇸🇬",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Singapore.png`,
    },
    日本: {
        weight: 40,
        pattern: "日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|Japan|🇯🇵",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Japan.png`,
    },
    韩国: {
        pattern: "KR|Korea|KOR|首尔|韩|韓|🇰🇷",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Korea.png`,
    },
    美国: {
        weight: 50,
        pattern: "美国|美|US|United States|🇺🇸",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/United_States.png`,
    },
    加拿大: {
        pattern: "加拿大|Canada|CA|🇨🇦",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Canada.png`,
    },
    英国: {
        weight: 60,
        pattern: "英国|United Kingdom|UK|伦敦|London|🇬🇧",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/United_Kingdom.png`,
    },
    澳大利亚: {
        pattern: "澳洲|澳大利亚|AU|Australia|🇦🇺",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Australia.png`,
    },
    德国: {
        weight: 70,
        pattern: "德国|德|DE|Germany|🇩🇪",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Germany.png`,
    },
    法国: {
        weight: 80,
        pattern: "法国|法|FR|France|🇫🇷",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/France.png`,
    },
    俄罗斯: {
        pattern: "俄罗斯|俄|RU|Russia|🇷🇺",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Russia.png`,
    },
    泰国: {
        pattern: "泰国|泰|TH|Thailand|🇹🇭",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Thailand.png`,
    },
    印度: {
        pattern: "印度|IN|India|🇮🇳",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/India.png`,
    },
    马来西亚: {
        pattern: "马来西亚|马来|MY|Malaysia|🇲🇾",
        icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Malaysia.png`,
    },
};
