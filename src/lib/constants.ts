export type cancerDataUnformatted = {
    County: string; // "Union County, Florida(6)"
    FIPS: number; // 12125, 27155, 48373
    '2023 Rural-Urban Continuum Codes([rural urban note])': string; // "Rural"
    'Age-Adjusted Incidence Rate([rate note]) - cases per 100,000': number; // 1248.4, 693.5, 679.5
    'Lower 95% Confidence Interval': number; // 1177.5, 588.2, 648.4
    'Upper 95% Confidence Interval': number; // 1322.7, 814.3, 711.8
    'CI*Rank([rank note])': string | null; // "N/A" -> null
    'Lower CI (CI*Rank)': string | null; // "N/A" -> null
    'Lower 95% Confidence Interval Percent': number;
    'Upper CI (CI*Rank)': string | null; // "N/A" -> null
    'Upper 95% Confidence Interval Percent': number;
    'Average Annual Count': number; // 245, 37, 436
    'Recent Trend': string; // "stable"
    'Recent 5-Year Trend ([trend note]) in Incidence Rates': number; // 0.4, 2.2, -0.3
};

export type CancerData = {
    county: string; // "Union County, Florida(6)"
    fips: number; // 12125, 27155, 48373
    ruralUrbanCode: string; // "Rural"
    incidenceRate: number; // 1248.4, 693.5, 679.5 (numeric)
    lowerCI: number; // 1177.5, 588.2, 648.4 (numeric)
    upperCI: number; // 1322.7, 814.3, 711.8 (numeric)
    rankCI: string | null; // "N/A" -> null
    lowerRankCI: string | null; // "N/A" -> null
    lowerCIPercent: number;
    upperRankCI: string | null; // "N/A" -> null
    upperCIPercent: number;
    annualCount: number; // 245, 37, 436 (numeric)
    recentTrend: string; // "stable"
    fiveYearTrend: number; // 0.4, 2.2, -0.3 (numeric)
    lowerTrendCI: number; // -0.6, -0.9, -3.1 (numeric)
    upperTrendCI: number; // 1.5, 5.5, 2.5 (numeric)
};