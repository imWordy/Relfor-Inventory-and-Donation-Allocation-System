from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from app.core.database import get_db
from app.core.dependencies import require_staff_or_admin
from app.models.user import User
from app.schemas.report import (
    InventoryReportResponse,
    DonationReportResponse,
    AllocationReportResponse,
    DistributionReportResponse,
    PendingRequestReportResponse,
)
from app.services import report_service

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get(
    "/inventory",
    response_model=InventoryReportResponse,
    summary="Generate inventory stock report (Admin/Staff only)"
)
def get_inventory_report(
    category: Optional[str] = Query(None, description="Filter by category"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by stock status (AVAILABLE, LOW_STOCK, OUT_OF_STOCK)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    return report_service.get_inventory_report(db=db, category=category, status_filter=status_filter)

@router.get(
    "/inventory/export",
    summary="Export inventory report as CSV (Admin/Staff only)"
)
def export_inventory_csv(
    category: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    report = report_service.get_inventory_report(db=db, category=category, status_filter=status_filter)
    csv_data = report_service.generate_inventory_csv(report)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="inventory_report.csv"'}
    )

@router.get(
    "/donations",
    response_model=DonationReportResponse,
    summary="Generate donation intake report (Admin/Staff only)"
)
def get_donation_report(
    category: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    return report_service.get_donation_report(db=db, category=category, start_date=start_date, end_date=end_date)

@router.get(
    "/donations/export",
    summary="Export donations report as CSV (Admin/Staff only)"
)
def export_donations_csv(
    category: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    report = report_service.get_donation_report(db=db, category=category, start_date=start_date, end_date=end_date)
    csv_data = report_service.generate_donation_csv(report)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="donations_report.csv"'}
    )

@router.get(
    "/allocations",
    response_model=AllocationReportResponse,
    summary="Generate allocation history report (Admin/Staff only)"
)
def get_allocation_report(
    status_filter: Optional[str] = Query(None, alias="status"),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    return report_service.get_allocation_report(db=db, status_filter=status_filter, start_date=start_date, end_date=end_date)

@router.get(
    "/allocations/export",
    summary="Export allocations report as CSV (Admin/Staff only)"
)
def export_allocations_csv(
    status_filter: Optional[str] = Query(None, alias="status"),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    report = report_service.get_allocation_report(db=db, status_filter=status_filter, start_date=start_date, end_date=end_date)
    csv_data = report_service.generate_allocation_csv(report)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="allocations_report.csv"'}
    )

@router.get(
    "/distributions",
    response_model=DistributionReportResponse,
    summary="Generate distribution handover report (Admin/Staff only)"
)
def get_distribution_report(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    return report_service.get_distribution_report(db=db, start_date=start_date, end_date=end_date)

@router.get(
    "/distributions/export",
    summary="Export distributions report as CSV (Admin/Staff only)"
)
def export_distributions_csv(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    report = report_service.get_distribution_report(db=db, start_date=start_date, end_date=end_date)
    csv_data = report_service.generate_distribution_csv(report)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="distributions_report.csv"'}
    )

@router.get(
    "/pending-requests",
    response_model=PendingRequestReportResponse,
    summary="Generate pending requirement requests report (Admin/Staff only)"
)
def get_pending_requests_report(
    priority: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    return report_service.get_pending_requests_report(db=db, priority=priority)

@router.get(
    "/pending-requests/export",
    summary="Export pending requests report as CSV (Admin/Staff only)"
)
def export_pending_requests_csv(
    priority: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    report = report_service.get_pending_requests_report(db=db, priority=priority)
    csv_data = report_service.generate_pending_requests_csv(report)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="pending_requests_report.csv"'}
    )
