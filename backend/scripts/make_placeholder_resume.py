"""Generate a valid one-page placeholder resume PDF.

Written by hand rather than pulling in a PDF library, because the only requirement is a file
that opens correctly until a real resume replaces it. Run:

    python scripts/make_placeholder_resume.py
"""

from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "static" / "resume.pdf"

LINES = [
    (72, 720, 24, "Vihaan Rajagopal"),
    (72, 692, 12, "Software Engineer & Systems Researcher"),
    (72, 660, 11, "This is a placeholder document."),
    (72, 640, 11, "Replace backend/static/resume.pdf with the real resume."),
    (72, 608, 11, "The /api/resume endpoint serves whatever file is at that path."),
]


def escape(text: str) -> str:
    return text.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")


def build() -> bytes:
    content_parts = ["BT"]
    for x, y, size, text in LINES:
        content_parts.append(f"/F1 {size} Tf 1 0 0 1 {x} {y} Tm ({escape(text)}) Tj")
    content_parts.append("ET")
    stream = "\n".join(content_parts).encode("latin-1")

    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
        b"/Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n" + stream + b"\nendstream",
    ]

    out = bytearray(b"%PDF-1.4\n")
    offsets = []
    for index, body in enumerate(objects, start=1):
        offsets.append(len(out))
        out += f"{index} 0 obj\n".encode() + body + b"\nendobj\n"

    xref_pos = len(out)
    out += f"xref\n0 {len(objects) + 1}\n".encode()
    out += b"0000000000 65535 f \n"
    for offset in offsets:
        out += f"{offset:010d} 00000 n \n".encode()
    out += (
        f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_pos}\n".encode()
    )
    out += b"%%EOF\n"
    return bytes(out)


if __name__ == "__main__":
    import sys

    # The real resume now lives at this path. Refuse to overwrite it -- this script exists
    # only to seed a placeholder on a fresh checkout.
    if OUT.exists() and OUT.stat().st_size > 5000:
        print(f"{OUT} already holds a real resume ({OUT.stat().st_size} bytes). Not overwriting.")
        print("Delete the file first if you genuinely want the placeholder back.")
        sys.exit(0)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_bytes(build())
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")
