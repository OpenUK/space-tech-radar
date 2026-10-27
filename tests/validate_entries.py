import csv, json, re, sys

def read(path):
    with open(path, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    # strip control characters and surrounding whitespace before any checks
    return [{k: re.sub(r"[\x00-\x1f\x7f]", "", v or "").strip() for k, v in r.items()} for r in rows]

rules = {}
for r in read("radar/rules.csv"):
    rules.setdefault(r["type"], set()).add(r["value"])

errors = []
for path in ("radar/eo.csv", "radar/space.csv"):
    seen = set()
    for r in read(path):
        name = f"{path}: {r['Name']}"
        if r["Name"].strip().lower() in seen:
            errors.append(f"{name}: duplicate")
        seen.add(r["Name"].strip().lower())
        if r["Quadrant"] not in rules["quadrant"]:
            errors.append(f"{name}: bad quadrant {r['Quadrant']}")
        if r["Ring"] not in rules["ring"]:
            errors.append(f"{name}: bad ring {r['Ring']}")
        if r["Ring"] != "Dead" and not re.fullmatch(r"https://github\.com/[\w.-]+/[\w.-]+/?", r["Link"]):
            errors.append(f"{name}: Link must be a GitHub repository")
        try:
            tags = json.loads(r["Tags"])
        except ValueError:
            tags = []
            errors.append(f"{name}: Tags is not valid JSON")
        for t in tags:
            if t not in rules["tag"]:
                errors.append(f"{name}: bad tag {t}")

print("\n".join(errors) or "All entries valid")
sys.exit(1 if errors else 0)
