
from sqlalchemy import Column, UUID, String, Boolean,Enum as SQLAEnum
from sqlalchemy.orm import relationship
from .enums import UserRole
from src.db.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(UUID, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(SQLAEnum(UserRole), default=UserRole.CUSTOMER)  