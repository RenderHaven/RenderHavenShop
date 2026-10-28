from src.db.models import User
class AuthRepo:
    
    def __init__(self, db):
        self.db=db

    async def get_user_by_email(self, email: str):
        user= await self.db.query(User).filter(User.email == email).first()
        return user

    async def create_user(self, email: str, hashed_password: str):
        new_user = User(email=email, hashed_password=hashed_password)
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)
        return new_user