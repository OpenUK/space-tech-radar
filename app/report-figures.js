import { renderCountryMap } from "./country-map.js";

// Report figures use local data only; source links are citations, never fetches.
const SOURCES = {
  copernicus: {
    title: "Copernicus Data Space Ecosystem: Annual Report 2024",
    url: "https://dataspace.copernicus.eu/news/2025-12-4-copernicus-data-space-ecosystem-cdse-releases-annual-report-2024",
    aliases: ["https://s3.waw3-1.cloudferro.com/swift/v1/portal_uploads_prod/Copernicus_Annual_Report_2024.pdf"]
  },
  gaia: { title: "ESA: Gaia DR3 contents and release comparison", url: "https://www.cosmos.esa.int/web/gaia/dr3" },
  pangeo: { title: "Pangeo community and software ecosystem", url: "https://pangeo.io/" },
  astropy: { title: "Astropy coordinated and affiliated packages", url: "https://www.astropy.org/affiliated/" },
  astropyDocs: { title: "Astropy documentation", url: "https://docs.astropy.org/en/stable/index.html" },
  astroquery: { title: "Astroquery documentation", url: "https://astroquery.readthedocs.io/en/latest/" },
  photutils: { title: "Photutils documentation", url: "https://photutils.readthedocs.io/en/stable/" },
  specutils: { title: "Specutils documentation", url: "https://specutils.readthedocs.io/en/stable/" },
  terra: { title: "terra: spatial data analysis in R", url: "https://rspatial.github.io/terra/" },
  sf: { title: "sf: simple features for R", url: "https://r-spatial.github.io/sf/" },
  rasters: { title: "Rasters.jl documentation", url: "https://rafaqz.github.io/Rasters.jl/stable/" },
  fitsio: { title: "FITSio: FITS utilities for R", url: "https://cran.r-project.org/package=FITSio" },
  healpix: { title: "HEALPix: purpose and spherical analysis", url: "https://healpix.sourceforge.io/index.php" },
  rhealpix: { title: "Gibb, Raichev and Speth: rHEALPix (2013 preprint)", url: "https://raichev.net/files/rhealpix_dggs_preprint.pdf" },
  stac: { title: "The STAC specification", url: "https://stacspec.org/en/about/stac-spec/" },
  cog: { title: "Cloud Optimized GeoTIFF", url: "https://cogeo.org/" },
  hirise: { title: "USGS: HiRISE analysis-ready Mars imagery", url: "https://stac.astrogeology.usgs.gov/docs/data/mars/uncontrolled_hirise/" }
};

const GAIA = {
  unit: "catalogue sources",
  period: "DR1–DR3",
  source: "gaia",
  values: [
    { release: "DR1", count: 1142679769 },
    { release: "DR2", count: 1692919135 },
    { release: "DR3", count: 1811709771 }
  ]
};

const SENTINEL = {
  unit: "petabytes (PB)",
  period: "2015–2024",
  source: "copernicus",
  note: "The existing image is an approximate replot of the published figure. 2023 covers January–October; 2024 covers January–December and uses a different data access platform. Downloads do not measure newly acquired imagery."
};

const number = new Intl.NumberFormat("en-GB");
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

function link(text, url) {
  const node = el("a", "", text);
  node.href = url;
  return node;
}

function sourceLink(context, key, label) {
  const source = SOURCES[key];
  context.sources.set(key, source);
  return link(label || source.title, source.url);
}

function figure(context, key, title, caption) {
  const node = el("figure", "report-figure");
  const id = `report-${context.mode}-${key}`;
  node.id = id;
  const label = el("div", "figure-number", `Figure ${++context.figureNumber}`);
  const heading = el("h3", "figure-title", title);
  heading.id = `${id}-title`;
  const description = el("figcaption", "figure-caption", caption);
  description.id = `${id}-caption`;
  const content = el("div", "figure-content");
  node.setAttribute("aria-labelledby", heading.id);
  node.setAttribute("aria-describedby", description.id);
  node.append(label, heading, content, description);
  return { node, content, description };
}

function cite(target, context, keys) {
  const sources = el("span", "figure-sources", "Sources: ");
  keys.forEach((key, index) => {
    if (index) sources.append("; ");
    sources.append(sourceLink(context, key));
  });
  target.append(sources);
}

function table(headers, rows, caption) {
  const node = el("table", "report-table");
  node.append(el("caption", "", caption));
  const head = el("thead");
  const header = el("tr");
  headers.forEach((text) => {
    const cell = el("th", "", text);
    cell.scope = "col";
    header.append(cell);
  });
  head.append(header);
  const body = el("tbody");
  rows.forEach((values) => {
    const row = el("tr");
    values.forEach((value, index) => {
      const cell = el(index ? "td" : "th");
      if (!index) cell.scope = "row";
      cell.append(value);
      row.append(cell);
    });
    body.append(row);
  });
  node.append(head, body);
  return node;
}

function dataDetails(content, summary = "View data table") {
  const details = el("details", "figure-data");
  details.append(el("summary", "", summary), content);
  return details;
}

function geography(context) {
  const result = figure(context, "eo-geography", "EO open source around the world");
  result.content.append(el("p", "figure-unit", "Loading country locations…"));
  renderCountryMap(result.content).catch(() => {
    result.content.replaceChildren(el("p", "figure-unit", "Country locations could not be loaded."));
  });
  const sources = el("span", "figure-sources");
  sources.append("Made with ", link("Natural Earth", "https://www.naturalearthdata.com/"));
  result.description.append(sources);
  return result.node;
}

// Text stays in HTML so it wraps and remains legible when the SVG bar shrinks.
function barRow(label, count, maximum) {
  const row = el("div", "chart-row");
  row.append(el("span", "chart-label", label), el("span", "chart-value", number.format(count)));
  const svg = d3.select(row).append("svg")
    .attr("class", "chart-bar").attr("viewBox", "0 0 600 20")
    .attr("preserveAspectRatio", "none").attr("aria-hidden", "true");
  svg.append("rect").attr("width", 600).attr("height", 20).attr("fill", "#f1f5f3");
  const scale = d3.scaleLinear().domain([0, Math.max(1, maximum)]).range([0, 600]);
  svg.append("rect").attr("width", scale(count)).attr("height", 20).attr("fill", "#3b82f6");
  return row;
}

function gaia(context) {
  const result = figure(context, "gaia-scale", "Gaia catalogue scale",
    "Total sources in each Gaia release. These are catalogue sizes, not software adoption statistics; source lists are not additive across releases.");
  result.content.append(el("p", "figure-unit", `Unit: ${GAIA.unit} · releases ${GAIA.period} · bars start at zero`));
  const maximum = Math.max(...GAIA.values.map(({ count }) => count));
  GAIA.values.forEach(({ release, count }) => {
    result.content.append(barRow(release, count, maximum));
  });
  result.content.append(dataDetails(table(["Release", "Total sources"],
    GAIA.values.map(({ release, count }) => [release, number.format(count)]), `Gaia ${GAIA.period} · ${GAIA.unit}`)));
  cite(result.description, context, [GAIA.source]);
  return result.node;
}

function sentinel(context, marker) {
  // Wrap the authored Markdown image/caption without replacing or redrawing it.
  const paragraph = marker.nextElementSibling;
  const image = paragraph?.querySelector("img");
  if (!image) return null;
  const authoredCaption = paragraph.querySelector("em");
  const result = figure(context, "sentinel-downloads", "Sentinel data downloads",
    authoredCaption?.textContent || "Annual Sentinel data downloads, 2015–2024.");
  image.alt = "Stacked bars of Sentinel-1, Sentinel-2, Sentinel-3 and Sentinel-5P download volumes, 2015–2024, in petabytes. Values in this existing image are approximate; see the figure notes and linked report.";
  image.loading = "lazy";
  image.decoding = "async";
  result.content.append(el("p", "figure-unit", `Unit: ${SENTINEL.unit} · ${SENTINEL.period}`), image);
  const imageLink = el("p", "figure-image-link");
  imageLink.append(link("Open the full-size figure", image.src));
  result.content.append(imageLink);
  result.description.append(" ", SENTINEL.note);
  cite(result.description, context, [SENTINEL.source]);
  // The image has no exact underlying dataset here; do not invent one from pixels.
  result.content.append(dataDetails(table(["Field", "Source detail"], [
    ["Period", SENTINEL.period], ["Unit", SENTINEL.unit],
    ["Coverage", "2023: January–October. 2024: January–December; changed access platform."],
    ["Values", "Approximate replot retained as supplied; consult Figure 44, p. 55 of the source report."]
  ], "Sentinel figure provenance"), "View source details"));
  authoredCaption?.remove();
  if (!paragraph.textContent.trim() && !paragraph.children.length) paragraph.remove();
  return result.node;
}

function logo(file, name) {
  const image = el("img", "project-logo");
  image.src = new URL(`./assets/logos/${file}`, import.meta.url).href;
  image.alt = `${name} logo`;
  image.loading = "lazy";
  image.decoding = "async";
  return image;
}

function ecosystem(context, space) {
  const result = figure(context, space ? "space-ecosystem" : "earth-ecosystem",
    space ? "Around the Astropy core" : "Pangeo brings the pieces together",
    space
      ? "Selected core capabilities and coordinated packages in the Astropy project. Blue sectors identify core functionality; orange sectors identify separately distributed, project-maintained packages. Affiliated packages form a further, independently maintained community around the project."
      : "Selected components listed in Pangeo’s software ecosystem, grouped by their documented roles. The wheel illustrates the range of tools available for a geoscience workflow; its sectors do not measure usage or prescribe a processing order.");
  // Clockwise from the upper right; role labels also appear in the HTML groups.
  const groups = space ? [
    ["Archive access", "Astroquery", "Coordinated package", "astroquery.svg", SOURCES.astroquery.url],
    ["Photometry", "Photutils", "Coordinated package", "photutils.svg", SOURCES.photutils.url],
    ["Spectroscopy", "Specutils", "Coordinated package", "specutils.png", SOURCES.specutils.url],
    ["Files and tables", "FITS I/O · Table", "Astropy core", null, SOURCES.astropyDocs.url],
    ["Time and units", "Time · Quantity", "Astropy core", null, SOURCES.astropyDocs.url],
    ["Coordinates", "SkyCoord", "Astropy core", null, SOURCES.astropyDocs.url]
  ] : [
    ["Interactive work", "Jupyter", "Notebooks and interactive computing", "jupyter.svg", "https://jupyter.org/"],
    ["Computation", "Dask", "Parallel arrays and task execution", "dask.svg", "https://dask.org/"],
    ["Storage", "Zarr", "Chunked, compressed arrays", "zarr.svg", "https://zarr.readthedocs.io/"],
    ["Data access", "Intake", "Describe and load datasets", "intake.svg", "https://intake.readthedocs.io/"],
    ["Data model", "Xarray", "Labelled multidimensional arrays", "xarray.svg", "https://xarray.dev/"],
    ["Visualisation", "hvPlot", "High-level plotting", "hvplot.svg", "https://hvplot.holoviz.org/"]
  ];
  const colors = space
    ? ["#a84f16", "#a84f16", "#a84f16", "#355f93", "#355f93", "#355f93"]
    : ["#176b7a", "#267b61", "#526c9d", "#7564a0", "#ad5a2b", "#3e748a"];
  const map = el("div", "ecosystem-map");
  const wheel = el("div", "ecosystem-wheel");
  const svg = d3.select(wheel).append("svg").attr("viewBox", "0 0 480 480").attr("aria-hidden", "true");
  const centre = svg.append("g").attr("transform", "translate(240,240)");
  centre.append("circle").attr("r", 128).attr("fill", "#fff").attr("stroke", "#d7e8de");
  const arc = d3.arc().innerRadius(140).outerRadius(195).padAngle(0.07).cornerRadius(3);
  groups.forEach(([role, name, description, file, url], index) => {
    const start = index * Math.PI / 3;
    const end = start + Math.PI / 3;
    const angle = (start + end) / 2;
    const rotation = angle * 180 / Math.PI + (index > 1 && index < 5 ? 180 : 0);
    centre.append("path").attr("d", arc({ startAngle: start, endAngle: end })).attr("fill", colors[index]);
    centre.append("line")
      .attr("x1", Math.sin(angle) * 202).attr("y1", -Math.cos(angle) * 202)
      .attr("x2", Math.sin(angle) * 235).attr("y2", -Math.cos(angle) * 235)
      .attr("stroke", colors[index]).attr("stroke-dasharray", "3 4");
    centre.append("text")
      .attr("transform", `translate(${Math.sin(angle) * 168},${-Math.cos(angle) * 168}) rotate(${rotation})`)
      .attr("dy", "0.35em").attr("text-anchor", "middle").attr("fill", "#fff")
      .attr("font-size", 15).attr("font-weight", 600).text(role);
    const group = el("div", "ecosystem-group");
    group.style.setProperty("--map-column", index < 3 ? "3" : "1");
    group.style.setProperty("--map-row", String(index < 3 ? index + 1 : 6 - index));
    group.style.setProperty("--sector-color", colors[index]);
    const heading = el("div", "ecosystem-role", role);
    group.append(heading);
    if (file) group.append(logo(file, name));
    group.append(link(name, url), el("span", "ecosystem-description", description));
    map.append(group);
  });
  const hub = el("div", "ecosystem-core");
  hub.append(logo(space ? "astropy.svg" : "pangeo.svg", space ? "Astropy" : "Pangeo"));
  if (!space) hub.append(el("strong", "", "Pangeo"));
  hub.append(el("span", "", space ? "Astronomy in Python" : "Geoscience community"));
  wheel.append(hub);
  map.prepend(wheel);
  result.content.append(map);
  cite(result.description, context, space ? ["astropy", "astropyDocs", "astroquery", "photutils", "specutils"] : ["pangeo"]);
  return result.node;
}

function languages(context) {
  const space = context.mode === "space";
  const result = figure(context, "languages", "Languages and their tools",
    "Examples of language-specific tools for this domain. The selection illustrates available capabilities, without ranking popularity or claiming equal adoption.");
  const examples = space ? [
    ["Python", "python.svg", "Astronomy utilities and analysis", [["astropyDocs", "Astropy"], ["photutils", "Photutils"]]],
    ["R", "r.svg", "Reading and writing astronomical FITS data", [["fitsio", "FITSio"]]]
  ] : [
    ["Python", "python.svg", "Labelled arrays and parallel computation", [["pangeo", "Xarray and Dask"]]],
    ["R", "r.svg", "Spatial data analysis and vector geometries", [["terra", "terra"], ["sf", "sf"]]],
    ["Julia", "julia.svg", "Reading and manipulating raster datasets", [["rasters", "Rasters.jl"]]]
  ];
  const grid = el("div", "language-grid");
  grid.style.setProperty("--language-columns", String(examples.length));
  examples.forEach(([name, file, description, sources]) => {
    const item = el("div", "language-item");
    item.append(logo(file, name), el("strong", "", name), el("span", "", description));
    const links = el("div", "language-links");
    sources.forEach(([key, label], index) => {
      if (index) links.append(" · ");
      links.append(sourceLink(context, key, label));
    });
    item.append(links);
    grid.append(item);
  });
  result.content.append(grid);
  const credits = el("span", "figure-sources", "Logos: Python Software Foundation; R Foundation (CC BY-SA 4.0)");
  if (!space) credits.append("; Stefan Karpinski, Julia (CC BY-NC-SA 4.0)");
  credits.append(". ");
  credits.append(link("Image credits and licences", new URL("./assets/logos/ATTRIBUTIONS.md", import.meta.url).href));
  result.description.append(credits);
  return result.node;
}

// Domain symbols are illustrations, not grid geometries or observational data.
function domainSymbol(kind) {
  const colors = { sky: ["#f2effa", "#76639f"], earth: ["#eaf5ed", "#3d815b"], mars: ["#fff0e6", "#aa643e"] };
  const [fill, stroke] = colors[kind];
  const svg = d3.create("svg").attr("viewBox", "0 0 96 96")
    .attr("class", "exchange-symbol").attr("aria-hidden", "true")
    .attr("fill", "none").attr("stroke", stroke).attr("stroke-width", 1.5);
  svg.append("circle").attr("cx", 48).attr("cy", 48).attr("r", 34).attr("fill", fill);
  if (kind === "sky") {
    const stars = [[27, 55], [38, 30], [58, 42], [71, 29], [64, 65]];
    svg.append("polyline").attr("points", stars.map((point) => point.join(",")).join(" ")).attr("stroke-opacity", 0.45);
    stars.forEach(([x, y]) => svg.append("circle").attr("cx", x).attr("cy", y).attr("r", 2.5).attr("fill", stroke));
  } else if (kind === "earth") {
    svg.append("ellipse").attr("cx", 48).attr("cy", 48).attr("rx", 15).attr("ry", 34);
    svg.append("ellipse").attr("cx", 48).attr("cy", 48).attr("rx", 34).attr("ry", 13);
    svg.append("path").attr("d", "M14 48H82M48 14V82");
  } else {
    [[31, 40, 7], [57, 31, 4], [61, 63, 9]].forEach(([x, y, r]) => {
      svg.append("circle").attr("cx", x).attr("cy", y).attr("r", r).attr("stroke-opacity", 0.65);
    });
  }
  return svg.node();
}

function sharedMethods(context) {
  const result = figure(context, "shared-methods", "Open methods cross domains",
    "Two documented examples: an astronomical grid adapted for Earth mapping, and geospatial publication formats used for Mars imagery. The arrows show these specific relationships; the domain symbols are illustrative.");
  const routes = [
    {
      reverse: true,
      action: "Grid adaptation",
      source: ["sky", "Astronomy", [["healpix", "HEALPix"]], "Equal-area pixels for analysing the whole sky."],
      target: ["earth", "Earth mapping", [["rhealpix", "rHEALPix"]], "Extends the grid approach to ellipsoids such as WGS84."]
    },
    {
      reverse: false,
      action: "Format reuse",
      source: ["earth", "Earth observation", [["cog", "COG"], ["stac", "STAC"]], "Raster files for partial access, with catalogue metadata for discovery."],
      target: ["mars", "Planetary science", [["hirise", "Mars HiRISE imagery"]], "USGS publishes COG images with STAC records for this Mars collection."]
    }
  ];
  const flow = el("div", "exchange-flow");
  const node = ([kind, domain, sources, description], className) => {
    const card = el("div", `exchange-node ${className}`);
    const title = el("div", "exchange-title");
    sources.forEach(([key, name], index) => {
      if (index) title.append(" + ");
      title.append(sourceLink(context, key, name));
    });
    card.append(domainSymbol(kind), el("span", "exchange-domain", domain), title,
      el("span", "exchange-description", description));
    return card;
  };
  routes.forEach(({ reverse, action, source, target }) => {
    const row = el("div", `exchange-row${reverse ? " is-return" : ""}`);
    const direction = el("div", "exchange-direction");
    direction.append(el("span", "", action));
    const arrow = d3.select(direction).append("svg").attr("viewBox", "0 0 120 32")
      .attr("class", "exchange-arrow").attr("aria-hidden", "true");
    arrow.append("path").attr("d", "M4 16H112M103 7L112 16L103 25")
      .attr("fill", "none").attr("stroke", "currentColor").attr("stroke-width", 2);
    row.append(node(source, "exchange-source"), direction, node(target, "exchange-target"));
    flow.append(row);
  });
  result.content.append(flow);
  // Each example links directly to evidence; sourceLink also collects references.
  return result.node;
}

function resolveImages(body, root) {
  const base = new URL(`${root}/`, document.baseURI);
  body.querySelectorAll("img[src]").forEach((image) => {
    const src = image.getAttribute("src");
    // Only rewrite relative local paths; do not turn external URLs into local requests.
    if (!src || /^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(src)) return;
    const url = new URL(src, base);
    if (url.origin === base.origin) image.src = url.href;
  });
}

function references(body, context) {
  const section = el("section", "report-references");
  const existing = [...body.children].find((node) => node.tagName === "H2" && node.textContent.trim().toLowerCase() === "references");
  if (existing) {
    // Keep authored references verbatim and move them after the generated quadrants.
    let next = existing.nextElementSibling;
    section.append(existing);
    while (next && !next.matches("h1, h2, .quadrant-details")) {
      const following = next.nextElementSibling;
      section.append(next);
      next = following;
    }
  } else {
    section.append(el("h2", "", "References"));
  }
  let list = section.querySelector("ul");
  if (!list) {
    list = el("ul");
    section.append(list);
  }
  const canonical = (url) => {
    const absolute = new URL(url, document.baseURI).href.replace(/\/$/, "");
    const source = Object.values(SOURCES).find((item) => [item.url, ...(item.aliases || [])]
      .some((alias) => alias.replace(/\/$/, "") === absolute));
    return source ? source.url : absolute;
  };
  const seen = new Set([...section.querySelectorAll("a[href]")].map((anchor) => canonical(anchor.href)));
  context.sources.forEach((source) => {
    const key = canonical(source.url);
    if (seen.has(key)) return;
    seen.add(key);
    const item = el("li");
    item.append(link(source.title, source.url));
    list.append(item);
  });
  body.append(section);
}

function contents(body, context) {
  const nav = el("nav", "report-contents");
  nav.setAttribute("aria-label", `${context.label} report contents`);
  nav.append(el("div", "contents-label", "In this report"));
  const list = el("ol");
  list.setAttribute("role", "list");
  let sectionNumber = 0;
  body.querySelectorAll("h2").forEach((heading, index) => {
    if (heading.closest(".report-figure")) return;
    const title = heading.textContent;
    heading.id ||= `report-${context.mode}-section-${index + 1}`;
    const reference = heading.closest(".report-references");
    const label = reference ? "" : String(++sectionNumber).padStart(2, "0");
    if (label) {
      const prefix = el("span", "section-number", label);
      prefix.setAttribute("aria-hidden", "true");
      heading.prepend(prefix);
    }
    const item = el("li");
    const anchor = link(title, `#${heading.id}`);
    if (label) anchor.prepend(el("span", "contents-number", label));
    item.append(anchor);
    list.append(item);
  });
  nav.append(list);
  body.prepend(nav);
}

export function renderReport(body, data) {
  const context = { ...data.report, sources: new Map(), figureNumber: 0 };
  // renderStory supplies a fresh, inert Markdown fragment on every mode change.
  resolveImages(body, data.report.root);
  const walker = document.createTreeWalker(body, NodeFilter.SHOW_COMMENT);
  const markers = [];
  while (walker.nextNode()) markers.push(walker.currentNode);
  const seen = new Set();
  markers.forEach((marker) => {
    const key = marker.textContent.trim().match(/^report-figure: ([a-z-]+)$/)?.[1];
    if (!key) return;
    if (seen.has(key)) { marker.remove(); return; }
    let node;
    if (context.mode === "earth" && key === "eo-geography") node = geography(context);
    if (key === "languages") node = languages(context);
    if (key === "shared-methods") node = sharedMethods(context);
    if (context.mode === "earth" && key === "sentinel-downloads") node = sentinel(context, marker);
    if (context.mode === "earth" && key === "earth-ecosystem") node = ecosystem(context, false);
    if (context.mode === "space" && key === "gaia-scale") node = gaia(context);
    if (context.mode === "space" && key === "space-ecosystem") node = ecosystem(context, true);
    if (node) { marker.replaceWith(node); seen.add(key); }
  });
  references(body, context);
  contents(body, context);
}
