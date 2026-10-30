const COLORS = { Low: "#d5eedf", Moderate: "#55b78d", High: "#0b4f38", "No mapped data": "#e6eae7" };
const DISTRIBUTION = {
  "AE": "Low",
  "AR": "Low",
  "AT": "Moderate",
  "AU": "Moderate",
  "BE": "Moderate",
  "BG": "Low",
  "BR": "Moderate",
  "CA": "Moderate",
  "CH": "Moderate",
  "CL": "Low",
  "CN": "Low",
  "CY": "Low",
  "CZ": "Low",
  "DE": "High",
  "DK": "Low",
  "DZ": "Low",
  "EC": "Low",
  "EE": "Low",
  "ES": "Moderate",
  "FI": "Low",
  "FR": "High",
  "GB": "High",
  "GL": "Low",
  "GR": "Low",
  "HK": "Low",
  "HR": "Low",
  "HU": "Low",
  "ID": "Low",
  "IE": "Low",
  "IL": "Low",
  "IN": "Moderate",
  "IR": "Low",
  "IS": "Low",
  "IT": "Moderate",
  "JP": "Low",
  "KE": "Low",
  "KR": "Low",
  "KZ": "Low",
  "LK": "Low",
  "LU": "Low",
  "LV": "Low",
  "MN": "Low",
  "MX": "Low",
  "MY": "Low",
  "NC": "Low",
  "NG": "Low",
  "NL": "Moderate",
  "NO": "Moderate",
  "NP": "Low",
  "NZ": "Low",
  "PE": "Low",
  "PK": "Low",
  "PL": "Low",
  "PT": "Low",
  "RO": "Low",
  "RS": "Low",
  "RU": "Low",
  "SA": "Low",
  "SE": "Low",
  "SG": "Low",
  "SI": "Low",
  "SK": "Low",
  "SY": "Low",
  "TH": "Low",
  "TR": "Low",
  "UA": "Low",
  "US": "High",
  "VN": "Low",
  "ZA": "Low"
};

const element = (tag, className, text) => {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

export async function renderCountryMap(container) {
  const world = await d3.json(new URL("./assets/world-countries.geojson", import.meta.url));
  const band = (feature) => DISTRIBUTION[feature.properties.code];
  const label = (feature) => `${feature.properties.name}: ${band(feature)} representation`;
  container.replaceChildren();
  container.classList.add("country-map");

  const map = element("div", "country-map-plot");
  container.append(map);
  const projection = d3.geoNaturalEarth1().fitExtent([[8, 8], [792, 420]], world);
  const path = d3.geoPath(projection).pointRadius(3.5);
  const svg = d3.select(map).append("svg").attr("viewBox", "0 0 800 430")
    .attr("role", "group").attr("aria-label", "Geographic distribution of EO libraries");
  svg.append("path").attr("d", path(d3.geoGraticule10())).attr("class", "country-map-grid");
  const shapes = svg.append("g").selectAll("path").data(world.features).join("path")
    .attr("d", path).attr("fill", (feature) => COLORS[band(feature) || "No mapped data"])
    .attr("class", "country-map-country").attr("data-country", (feature) => feature.properties.code)
    .attr("aria-hidden", (feature) => band(feature) ? null : "true")
    .attr("aria-label", (feature) => band(feature) ? label(feature) : null);
  shapes.filter(band).append("title").text(label);

  const legend = element("div", "country-map-legend");
  legend.append(element("strong", "", "Relative representation"));
  Object.entries(COLORS).forEach(([text, color]) => {
    const item = element("span", "", text);
    item.style.setProperty("--swatch", color);
    legend.append(item);
  });
  container.append(legend);
}
