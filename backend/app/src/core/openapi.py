from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi


def _mark_binary(schema: dict):
    # swagger ui only renders a file picker for format: binary
    if schema.get("contentMediaType") == "application/octet-stream":
        schema["format"] = "binary"
    for value in schema.values():
        if isinstance(value, dict):
            _mark_binary(value)
        elif isinstance(value, list):
            for v in value:
                if isinstance(v, dict):
                    _mark_binary(v)


def setup_openapi(app: FastAPI):
    def custom_openapi():
        if app.openapi_schema:
            return app.openapi_schema
        schema = get_openapi(title=app.title, version=app.version, routes=app.routes)
        _mark_binary(schema)
        app.openapi_schema = schema
        return schema

    app.openapi = custom_openapi
