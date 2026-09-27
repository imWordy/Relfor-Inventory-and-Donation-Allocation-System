from fastapi import FastAPI
from app.routers import health, auth, resources, inventory
from app.core.config import settings
from app.core.errors import register_exception_handlers

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for Relfor Inventory & Donation Allocation System",
    version="1.0.0"
)

register_exception_handlers(app)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(resources.router)
app.include_router(inventory.router)
