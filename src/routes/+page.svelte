<script lang="ts">
	import { json, csv } from 'd3';
	import type { DSVRowArray, DSVRowString } from 'd3-dsv';
	import type { FeatureCollection } from 'geojson';
	import { onMount } from 'svelte';
	import type { CancerData, cancerDataUnformatted } from '$lib/constants';
	import GeoMapCanvas from '$lib/components/map/GeoMapCanvas/GeoMapCanvas.svelte';
	import GeoMapSvg from '$lib/components/map/GeoMapSVG/GeoMapSVG.svelte';

	let data: DSVRowArray<keyof cancerDataUnformatted> | undefined; //cancer dataset
	//	#Incidence Rate Report for United States by County
	// #
	// #"All Cancer Sites (All Stages^), 2017-2021"
	// #
	// #"All Races (includes Hispanic), Both Sexes, All Ages"
	// #
	// #Sorted by Rate
	// #

	// END

	// 	Created by statecancerprofiles.cancer.gov on 10/14/2024 12:57 pm.

	// "Alaska Census Area Name Change: please note that Wade Hampton Census Area, AK (FIPS code=02270) was renamed effective July 1, 2015, and the new name is Kusilvak Census Area (FIPS Code=02158). This website now uses Kusilvak."

	// "South Dakota County Name Change: please note that Shannon County, SD (FIPS code=46113) was renamed effective May 1, 2015, and the new name is Oglala Lakota County (FIPS Code=46102). This website now uses Oglala Lakota."

	// State Cancer Registries may provide more current or more local data.

	// Trend
	//    Rising when 95% confidence interval of average annual percent change is above 0.
	//    Stable when 95% confidence interval of average annual percent change includes 0.
	//    Falling when 95% confidence interval of average annual percent change is below 0.

	// "[rate note] Incidence rates (cases per 100,000 population per year) are age-adjusted to the 2000 US standard population [http://www.seer.cancer.gov/stdpopulations/stdpop.19ages.html] (19 age groups: <1, 1-4, 5-9, ... , 80-84, 85+). Rates are for invasive cancer only (except for bladder cancer which is invasive and in situ) or unless otherwise specified. Rates calculated using SEER*Stat. Population counts for denominators are based on Census populations as modified [https://seer.cancer.gov/popdata/] by NCI. The US Population Data File [https://seer.cancer.gov/popdata/] is used for SEER and NPCR incidence rates."
	// "[trend note] Incidence data come from different sources. The Average Annual Percent Change (AAPC) is based on the APCs calculated by Joinpoint. Due to data availability issues, the time period used in the calculation of the joinpoint regression model may differ [ https://statecancerprofiles.cancer.gov/historicaltrend/differences.html ] for selected counties."

	// Rates and trends are computed using different standards for malignancy. For more information see malignant.html.

	// "^ All Stages refers to any stage in the Surveillance, Epidemiology, and End Results (SEER) Summary/Historic Combined Summary Stage (2004+) [ https://seer.cancer.gov/tools/ssm/ ]."
	// "[rank note]Results presented with the CI*Rank statistics help show the usefulness of ranks. For example, ranks for relatively rare diseases or less populated areas may be essentially meaningless because of their large variability, but ranks for more common diseases in densely populated regions can be very useful. More information about methodology can be found on the CI*Rank website."
	// [rural urban note] Rural-Urban Continuum Codes provided by the USDA [ https://www.ers.usda.gov/data-products/rural-urban-continuum-codes ].
	// Puerto Rico is treated as urban because over 90% of the population lives in urban areas.
	// "* Data has been suppressed to ensure confidentiality and stability of rate estimates.  Counts are suppressed if fewer than 16 records were reported in a specific area-sex-race category. If an average count of 3 is shown, the total number of cases for the time period is 16 or more which exceeds suppression threshold (but is rounded to 3)."
	// Data not available [http://statecancerprofiles.cancer.gov/datanotavailable.html] for this combination of data selections.
	// "1 Source: National Program of Cancer Registries [ https://www.cdc.gov/cancer/npcr/index.htm ] and Surveillance, Epidemiology, and End Results [ http://seer.cancer.gov ] SEER*Stat Database - United States Department of Health and Human Services, Centers for Disease Control and Prevention and National Cancer Institute. Based on the 2023 submission."
	// "6 Source: National Program of Cancer Registries SEER*Stat Database - United States Department of Health and Human Services, Centers for Disease Control and Prevention (based on the 2023 submission).  [ https://www.cdc.gov/cancer/npcr/index.htm ]"
	// 7 Source: SEER November 2023 submission.
	// "8 Source: Incidence data provided by the SEER Program. ( http://seer.cancer.gov ) AAPCs are calculated by the Joinpoint Regression Program ( https://surveillance.cancer.gov/joinpoint/ ) and are based on APCs. Data are age-adjusted to the 2000 US standard population ( http://www.seer.cancer.gov/stdpopulations/single_age.html ) (19 age groups: <1, 1-4, 5-9, ... , 80-84,85+). Rates are for invasive cancer only (except for bladder cancer which is invasive and in situ) or unless otherwise specified. Population counts for denominators are based on Census populations as modified by NCI. The US Population Data ( http://seer.cancer.gov/popdata/ ) File is used with SEER November 2023 data."

	// "Note: This website still uses Connecticut counties instead of planning regions for consistency of geographies across data topics. If/when all data sources have new planning regions, then this website will switch to using them. 2013 Rural-Urban Continuum Codes will be used for Connecticut counties."

	// Data for the United States does not include data from Indiana.
	// Data for the United States does not include Puerto Rico.

	const cancerDataHeaderMap: Record<keyof cancerDataUnformatted, keyof CancerData> = {
		County: 'county',
		FIPS: 'fips',
		'2023 Rural-Urban Continuum Codes([rural urban note])': 'ruralUrbanCode',
		'Age-Adjusted Incidence Rate([rate note]) - cases per 100,000': 'incidenceRate',
		'Lower 95% Confidence Interval': 'lowerCI',
		'Lower 95% Confidence Interval Percent': 'lowerCIPercent',
		'Upper 95% Confidence Interval': 'upperCI',
		'Upper 95% Confidence Interval Percent': 'upperCIPercent',
		'CI*Rank([rank note])': 'rankCI',
		'Lower CI (CI*Rank)': 'lowerRankCI',
		'Upper CI (CI*Rank)': 'upperRankCI',
		'Average Annual Count': 'annualCount',
		'Recent Trend': 'recentTrend',
		'Recent 5-Year Trend ([trend note]) in Incidence Rates': 'fiveYearTrend'
	};

	function renameHeaders(data: DSVRowArray<keyof cancerDataUnformatted>): CancerData[] {
		return data.map((county: DSVRowString<keyof cancerDataUnformatted>) => {
			const cancerData: CancerData = {} as CancerData;
			for (const prop in county) {
				const newKey = cancerDataHeaderMap[prop as keyof cancerDataUnformatted] as keyof CancerData;
				// Check if newKey is valid
				if (newKey && county[prop as keyof typeof county] !== undefined) {
					const value = county[prop as keyof typeof county];

					// Check if value is 'N/A' (convert to null) or a number
					if (typeof value === 'string' && value.includes('N/A')) {
						// @ts-ignore
						cancerData[newKey] = null;
					} else if (!isNaN(Number(value))) {
						// Ensure that the value is a number
						// @ts-ignore
						cancerData[newKey] = parseFloat(value);
					} else {
						// Otherwise, just assign the value directly if it's a valid string
						// @ts-ignore
						cancerData[newKey] = value as CancerData[keyof CancerData];
					}
				}
			}
			return cancerData as CancerData;
		});
	}

	const geojsonPath =
		'https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json';
	let geojson: FeatureCollection;
	onMount(async () => {
		geojson = (await json(geojsonPath)) as FeatureCollection;

		try {
			data = await csv('/incd_nih.csv');
			const cleanedData = renameHeaders(data);

			console.log('cleanedData', cleanedData);
		} catch (error) {
			console.error('Error loading CSV:', error);
		}
	});

</script>


<h1>Where is Cancer in the US?</h1>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->

<GeoMapCanvas data={geojsonPath} />
<GeoMapSvg data={geojsonPath} />

