import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import Base, get_db
from app.core.security import hash_password, create_access_token
from app.models.organization import Organization
from app.models.user import User

# In-memory SQLite for isolated, fast, and repeatable testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()

    # Seed test organization
    org = Organization(
        id=uuid.uuid4(),
        name="Test NGO Foundation",
        type="NGO",
        registration_number="NGO/TEST/001",
        contact_person="Test NGO Rep",
        phone="+91 99999 11111",
        email="contact@testngo.org",
        address="123 Test Street",
        is_verified=True,
    )
    db.add(org)
    db.commit()

    # Seed test users
    admin_user = User(
        id=uuid.uuid4(),
        email="admin@relfor.org",
        password_hash=hash_password("AdminPass123!"),
        full_name="Admin Tester",
        role="ADMIN",
        organization_id=None,
        is_active=True,
    )
    staff_user = User(
        id=uuid.uuid4(),
        email="staff@relfor.org",
        password_hash=hash_password("StaffPass123!"),
        full_name="Staff Tester",
        role="STAFF",
        organization_id=None,
        is_active=True,
    )
    ngo_user = User(
        id=uuid.uuid4(),
        email="ngo@testngo.org",
        password_hash=hash_password("NgoPass123!"),
        full_name="NGO Tester",
        role="NGO",
        organization_id=org.id,
        is_active=True,
    )
    inactive_user = User(
        id=uuid.uuid4(),
        email="inactive@relfor.org",
        password_hash=hash_password("InactivePass123!"),
        full_name="Inactive Tester",
        role="STAFF",
        organization_id=None,
        is_active=False,
    )

    db.add_all([admin_user, staff_user, ngo_user, inactive_user])
    db.commit()

    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture
def admin_headers(db_session):
    admin = db_session.query(User).filter(User.email == "admin@relfor.org").first()
    token = create_access_token({"sub": str(admin.id), "email": admin.email, "role": admin.role})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def staff_headers(db_session):
    staff = db_session.query(User).filter(User.email == "staff@relfor.org").first()
    token = create_access_token({"sub": str(staff.id), "email": staff.email, "role": staff.role})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def ngo_headers(db_session):
    ngo = db_session.query(User).filter(User.email == "ngo@testngo.org").first()
    token = create_access_token({"sub": str(ngo.id), "email": ngo.email, "role": ngo.role, "organization_id": str(ngo.organization_id)})
    return {"Authorization": f"Bearer {token}"}
