# Space Tech Radar

An Earth and Space Observation Tech Radar for Downstream Science, Analytics, and Applications.

<!-- <img width="815" height="987" alt="image" src="https://github.com/user-attachments/assets/eebb8447-9cff-48a8-9a7a-e7166983e061" /> -->
<a href="https://sunnydean.github.io/space-tech-radar/">
  <img width="815" height="987" alt="image" src="https://github.com/user-attachments/assets/eebb8447-9cff-48a8-9a7a-e7166983e061" />
</a>

To update radar content, edit `config/eo.csv` and/or `config/space.csv`, then commit and push your changes.
The app reads these CSV files directly, and GitHub Actions deploys the site automatically.

# Contributing to the Space Tech Radar!

Contributions are welcome:

- Open source tools, libraries, standards and datasets for Earth and space observation
- Ring suggestions: should something move to Adopt, Trial, Assess or Hold, and why?
- Fixes to broken links, outdated descriptions and missing tags
- Examples and case studies for the story sections

## What It Includes

- Earth and Space toggle
- Interactive radar blips with popup details
- Side entry panels by quadrant
- Markdown-driven story section

## Quadrants

- Core Libraries (inner circle)
- Visualization
- Intelligence
- Data
- Standards

## Standards Sections

- Narrative
- Fast Adopters
- Open Data
- Commonalities
- Core Open Source Libraries
- Future

## Tagging

- Techniques
- Platform
- Core Library
- Server-Side
- Web-Tools
- Desktop
- Mobile
- Data Repository
- Database
- Data management
- Spatial analysis
- EO visualization
- Location parsing and EO referencing
- Remote sensing analysis
- Pangeo
- Simulation

## Run Locally

Serve the repository root:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.



## Test

```bash
python3 tests/validate_entries.py
```

Checks that every entry in `config/eo.csv` and `config/space.csv` uses a quadrant, ring and tags listed in `config/rules.csv`, and that names are not duplicated.