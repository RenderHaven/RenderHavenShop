
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    CUSTOM_ADMIN = "custom_admin"
    CUSTOMER = "customer"

class DiscountType(str, Enum):
    PERCENTAGE = "percentage"
    FIXED_AMOUNT = "fixed_amount"

class CategoryType(str, Enum):
    MAN="man"
    WOMAN="woman"
    UNISEX="unisex"