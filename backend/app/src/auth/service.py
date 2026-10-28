from src.core.security import verify_password, hash_password
from .repo import AuthRepo
class AuthService:
    def __init__(self, db):
        self.repo = AuthRepo(db)

    async def authenticate_user(self, email: str, password: str):
        user = await self.repo.get_user_by_email(email)
        if not user:
            return False
        if not verify_password(password, user.hashed_password):
            return False
        return user

    async def register_user(self, email: str, password: str):
        hashed_password = hash_password(password)
        user = await self.repo.create_user(email, hashed_password)
        return user