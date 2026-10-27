# Space Tech Radar

An Earth and Space Observation Tech Radar for Downstream Science, Analytics, and Applications.

<!-- <img width="815" height="987" alt="image" src="https://github.com/user-attachments/assets/eebb8447-9cff-48a8-9a7a-e7166983e061" /> -->
<a href="https://sunnydean.github.io/space-tech-radar/">
  <img width="815" height="987" alt="image" src="https://github.com/user-attachments/assets/eebb8447-9cff-48a8-9a7a-e7166983e061" />
</a>

## What's in the Radar?

The radar covers open source tools, open standards, openly accessible observation data repositories and reusable techniques that meet at least one of these criteria:

### The Litmus Test

- **Designed for the domain:** built for satellite Earth observation or space science in Analytics, Visualization, Data or Standards.
- **Critical foundation:** a core building block of established observation workflows, even if designed for wider use (for example Xarray or GDAL).

Being able to open satellite imagery alone does not qualify a general GIS application such as QGIS. Simulation tools need a direct role in analysing or interpreting observations.

# Contributing to the Space Tech Radar!

Contributions are welcome:

- Open source tools, libraries, standards and datasets for Earth and space observation
- Ring suggestions: should something move to Adopt, Trial, Assess or Hold, and why?
- Fixes to broken links, outdated descriptions and missing tags
- Examples and case studies for the story sections

To update radar content, edit [radar/eo.csv](radar/eo.csv) and/or [radar/space.csv](radar/space.csv), then commit and push your changes.
The app reads these CSV files directly, and GitHub Actions deploys the site automatically.
Keep entries considered but removed in the CSV with `Ring` set to `Dead`; they are hidden from the radar, and duplicate-name validation prevents adding them again.
Use the optional `Comment` field for notes, including why an entry was removed; comments are not displayed on the radar. For general-purpose foundations, explain their role and link to a concrete observation workflow in `Comment`.

Contributions to this project are subject to [OpenUK's Code of Respect policy](https://openuk.uk/wp-content/uploads/2020/08/Code-of-respect-Final-Aug-20.pdf).

## Disclaimer

This radar is human-maintained and reflects the judgement of its contributors. Please do not submit LLM-generated edits; contributions should be written and checked by a human.

## Categories

**Ring:** adoption status. **Quadrant:** area of use. **Tag:** descriptive label.

**CORE:** foundational libraries. **Analytics:** processing and analysis. **Visualization:** reusable data visualisation tools. **Data:** catalogs, archives and repositories. **Standards:** formats, metadata and protocols.

| Ring | Quadrant | Tag |
| --- | --- | --- |
| Core | CORE | Techniques |
| Adopt | Analytics | Platform |
| Trial | Visualization | Core Library |
| Assess | Data | Server-Side |
| Hold | Standards | Web-Tools |
| Dead |  | Desktop |
|  |  | Mobile |
|  |  | Data Repository |
|  |  | Database |
|  |  | Data management |
|  |  | Spatial analysis |
|  |  | EO visualization |
|  |  | Location parsing and EO referencing |
|  |  | Remote sensing analysis |
|  |  | Pangeo |
|  |  | 3D modeling |
|  |  | Cartography and visualisation |
|  |  | Geocoding and georeferencing |
|  |  | Simulation |

## Test

```bash
python3 tests/validate_entries.py
```

Checks that every entry in `radar/eo.csv` and `radar/space.csv` uses a quadrant, ring and tags listed in `radar/rules.csv`, and that names are not duplicated (including `Dead` entries).

## Maintainers

- [@sunnydean](https://github.com/sunnydean)

## Supported By

[Lampata](https://lampata.co.uk/)

<a href="https://lampata.co.uk/">
  <img src="app/assets/logos/lampata.svg" alt="Lampata" width="240" />
</a>
