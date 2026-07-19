from __future__ import annotations

import math
import re
from datetime import date, datetime
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

import pandas as pd
import psycopg


ROOT_DIR = Path(__file__).resolve().parents[1]
APP_ENV_PATH = ROOT_DIR / "ocfunfrenzy-app" / ".env"
WORKBOOK_PATH = Path(__file__).resolve().parent / "Past_20260405.xlsx"
SHEET_NAME = "data"

EXPECTED_COLUMNS = [
    "title",
    "content",
    "excerpt",
    "location",
    "zip_code",
    "image",
    "registration_info",
    "start_date",
    "end_date",
    "category",
    "type",
]


def get_database_url() -> str:
    env_text = APP_ENV_PATH.read_text(encoding="utf-8")
    match = re.search(r'^DATABASE_URL="?([^"\n]+)"?', env_text, re.MULTILINE)

    if not match:
        raise RuntimeError(f"DATABASE_URL was not found in {APP_ENV_PATH}")

    return normalize_psycopg_url(match.group(1))


def normalize_psycopg_url(database_url: str) -> str:
    parts = urlsplit(database_url)
    query = urlencode([(key, value) for key, value in parse_qsl(parts.query) if key != "schema"])

    return urlunsplit((parts.scheme, parts.netloc, parts.path, query, parts.fragment))


def clean_value(value: object) -> object:
    if value is None:
        return None

    if isinstance(value, float) and math.isnan(value):
        return None

    if pd.isna(value):
        return None

    if isinstance(value, pd.Timestamp):
        return value.date()

    if isinstance(value, datetime):
        return value.date()

    if isinstance(value, date):
        return value

    return value


def clean_zip_code(value: object) -> str | None:
    value = clean_value(value)

    if value is None:
        return None

    if isinstance(value, float) and value.is_integer():
        return str(int(value))

    if isinstance(value, int):
        return str(value)

    return str(value).strip()


def load_events() -> pd.DataFrame:
    events = pd.read_excel(WORKBOOK_PATH, sheet_name=SHEET_NAME)
    missing_columns = [column for column in EXPECTED_COLUMNS if column not in events.columns]

    if missing_columns:
        raise RuntimeError(f"Workbook is missing expected columns: {', '.join(missing_columns)}")

    return events[EXPECTED_COLUMNS]


def create_events_table(conn: psycopg.Connection) -> None:
    with conn.cursor() as cur:
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS events (
                id BIGSERIAL PRIMARY KEY,
                source_row INTEGER NOT NULL UNIQUE,
                title TEXT,
                content TEXT,
                excerpt TEXT,
                location TEXT,
                zip_code TEXT,
                image TEXT,
                registration_info TEXT,
                start_date DATE,
                end_date DATE,
                category TEXT,
                type TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )
            """
        )


def upload_events(conn: psycopg.Connection, events: pd.DataFrame) -> int:
    inserted = 0

    with conn.cursor() as cur:
        for source_row, row in enumerate(events.itertuples(index=False), start=2):
            values = {
                "source_row": source_row,
                "title": clean_value(row.title),
                "content": clean_value(row.content),
                "excerpt": clean_value(row.excerpt),
                "location": clean_value(row.location),
                "zip_code": clean_zip_code(row.zip_code),
                "image": clean_value(row.image),
                "registration_info": clean_value(row.registration_info),
                "start_date": clean_value(row.start_date),
                "end_date": clean_value(row.end_date),
                "category": clean_value(row.category),
                "type": clean_value(row.type),
            }

            cur.execute(
                """
                INSERT INTO events (
                    source_row,
                    title,
                    content,
                    excerpt,
                    location,
                    zip_code,
                    image,
                    registration_info,
                    start_date,
                    end_date,
                    category,
                    type
                )
                VALUES (
                    %(source_row)s,
                    %(title)s,
                    %(content)s,
                    %(excerpt)s,
                    %(location)s,
                    %(zip_code)s,
                    %(image)s,
                    %(registration_info)s,
                    %(start_date)s,
                    %(end_date)s,
                    %(category)s,
                    %(type)s
                )
                ON CONFLICT (source_row) DO UPDATE SET
                    title = EXCLUDED.title,
                    content = EXCLUDED.content,
                    excerpt = EXCLUDED.excerpt,
                    location = EXCLUDED.location,
                    zip_code = EXCLUDED.zip_code,
                    image = EXCLUDED.image,
                    registration_info = EXCLUDED.registration_info,
                    start_date = EXCLUDED.start_date,
                    end_date = EXCLUDED.end_date,
                    category = EXCLUDED.category,
                    type = EXCLUDED.type,
                    updated_at = now()
                """,
                values,
            )
            inserted += 1

    return inserted


def main() -> None:
    events = load_events()
    database_url = get_database_url()

    with psycopg.connect(database_url) as conn:
        create_events_table(conn)
        uploaded_count = upload_events(conn, events)
        conn.commit()

        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM events")
            database_count = cur.fetchone()[0]

    print(f"Uploaded {uploaded_count} workbook rows into events.")
    print(f"Database events row count: {database_count}.")


if __name__ == "__main__":
    main()
