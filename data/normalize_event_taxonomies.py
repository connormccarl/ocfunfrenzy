from __future__ import annotations

import re
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

import psycopg


ROOT_DIR = Path(__file__).resolve().parents[1]
APP_ENV_PATH = ROOT_DIR / "ocfunfrenzy-app" / ".env"


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


def clean_label(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def normalize_key(value: str) -> str:
    return clean_label(value).casefold()


def split_labels(value: str | None) -> list[str]:
    if not value:
        return []

    labels: list[str] = []

    for part in value.split(","):
        label = clean_label(part)

        if label:
            labels.append(label)

    return labels


def create_taxonomy_table(conn: psycopg.Connection, table_name: str) -> None:
    with conn.cursor() as cur:
        cur.execute(
            f"""
            CREATE TABLE IF NOT EXISTS {table_name} (
                id BIGSERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                normalized_name TEXT NOT NULL UNIQUE,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
            )
            """
        )
        cur.execute(f"TRUNCATE TABLE {table_name} RESTART IDENTITY")


def get_distinct_labels(conn: psycopg.Connection, source_column: str) -> list[tuple[str, str]]:
    labels_by_key: dict[str, str] = {}

    with conn.cursor() as cur:
        cur.execute(f"SELECT {source_column} FROM events WHERE {source_column} IS NOT NULL")

        for (raw_value,) in cur.fetchall():
            for label in split_labels(raw_value):
                key = normalize_key(label)
                labels_by_key.setdefault(key, label)

    return sorted(
        ((label, key) for key, label in labels_by_key.items()),
        key=lambda item: item[1],
    )


def insert_taxonomy_labels(conn: psycopg.Connection, table_name: str, labels: list[tuple[str, str]]) -> None:
    with conn.cursor() as cur:
        cur.executemany(
            f"""
            INSERT INTO {table_name} (name, normalized_name)
            VALUES (%s, %s)
            ON CONFLICT (normalized_name) DO UPDATE SET
                name = EXCLUDED.name,
                updated_at = now()
            """,
            labels,
        )


def normalize_taxonomy(conn: psycopg.Connection, source_column: str, table_name: str) -> int:
    create_taxonomy_table(conn, table_name)
    labels = get_distinct_labels(conn, source_column)
    insert_taxonomy_labels(conn, table_name, labels)

    return len(labels)


def main() -> None:
    database_url = get_database_url()

    with psycopg.connect(database_url) as conn:
        category_count = normalize_taxonomy(conn, "category", "event_categories")
        count = normalize_taxonomy(conn, "type", "event_types")
        conn.commit()

    print(f"Created {category_count} unique event_categories records.")
    print(f"Created {count} unique event_types records.")


if __name__ == "__main__":
    main()
