"""Application settings, resolved from environment variables or a local .env file."""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    """Runtime configuration.

    Every value has a sensible development default so the API boots with no .env present.
    """

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env", env_file_encoding="utf-8", extra="ignore"
    )

    app_name: str = "Vihaan Rajagopal — Portfolio API"
    version: str = "1.0.0"
    environment: str = "development"

    # Comma-separated list of origins permitted to call the API from a browser.
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:8080"

    # Contact form
    contact_rate_limit: int = 5
    contact_rate_window_seconds: int = 3600
    data_dir: Path = BASE_DIR / "data"
    static_dir: Path = BASE_DIR / "static"
    resume_filename: str = "resume.pdf"

    # Optional SMTP relay. When smtp_host is empty, submissions are stored only.
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from: str = ""
    smtp_to: str = ""

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def messages_path(self) -> Path:
        return self.data_dir / "messages.jsonl"

    @property
    def resume_path(self) -> Path:
        return self.static_dir / self.resume_filename


@lru_cache
def get_settings() -> Settings:
    return Settings()
