from fastapi import FastAPI
from app.routers import health, auth, resources, requests, allocations, distributions, donations
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
app.include_router(requests.router)
app.include_router(allocations.router)
app.include_router(distributions.router)
app.include_router(donations.router)
