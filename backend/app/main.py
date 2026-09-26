from fastapi import FastAPI
from app.routers import health
from app.core.config import settings
from app.core.errors import register_exception_handlers

app = FastAPI(title=settings.PROJECT_NAME)

register_exception_handlers(app)

app.include_router(health.router)
