# Space Observation Open Source Technologies

Space science depends on software to turn telescope and spacecraft data into results. Open source lets others inspect, improve and reuse the methods behind those results. Sharing that work helps knowledge and tools outlast the projects that first needed them - and this is where open source shines in space.

## Open Data and Where I can get it

That starts with access to the measurements. Public archives preserve telescope and spacecraft data alongside the documentation needed to interpret them. Researchers can return to those records with new questions, often long after a mission has ended. Open software helps turn that access into analysis others can reproduce and build on.

<!-- report-figure: gaia-scale -->

## Who's Adopting Space Open Source?

Adoption grows through everyday research. Mission teams and individual researchers share the code behind their methods, and useful pieces become tools that others improve and maintain. Work that began with one instrument or study can become shared infrastructure for a wider community.

## What's Common Between Space and Earth?

Earth observation offers a useful lesson: prepare imagery for analysis so researchers can use it without repeating the same groundwork. That approach is now being [applied to planetary data](https://stac.astrogeology.usgs.gov/docs/about/). Images of Mars are [published as Cloud Optimized GeoTIFFs and indexed with STAC](https://stac.astrogeology.usgs.gov/docs/data/mars/uncontrolled_hirise/), making them usable in familiar mapping tools. Software and practices developed for studying Earth can help researchers explore another planet.

<!-- report-figure: shared-methods -->

## Core Open Source Libraries

Shared libraries handle common work such as coordinates, time, units and file formats. [Astropy](https://docs.astropy.org/en/stable/index.html) provides much of that foundation, with specialist tools adding methods for images, spectra and changes over time. Building on these components leaves researchers more room to focus on their scientific questions.

<!-- report-figure: space-ecosystem -->

## Languages and Frameworks

Python connects much of this ecosystem, from data access to analysis and plotting. Astropy supplies shared astronomy utilities, while packages such as Photutils add methods for working with astronomical sources. R also has tools for this work, including FITSio for reading and writing astronomical FITS data. These are examples of available tools, rather than a measure of how widely each language is used.

<!-- report-figure: languages -->

## Future

Growing archives need tools that can compare and combine ever larger datasets. Keeping those tools dependable also takes sustained funding, testing and documentation. [Tollerud et al. (2019)](https://baas.aas.org/pub/2020n7i180/release/1) argue that community software deserves support as research infrastructure. Its future depends on recognising maintainers' work and helping new contributors take part.

## References

- Tollerud et al. (2019). [Sustaining Community-Driven Software for Astronomy in the 2020s](https://baas.aas.org/pub/2020n7i180/release/1).
- [Astropy documentation](https://docs.astropy.org/en/stable/index.html).
- [Planetary Analysis Ready Data](https://stac.astrogeology.usgs.gov/docs/about/).
