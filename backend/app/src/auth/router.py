from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from src.db.database import get_db
from src.core.security import verify_password
from src.auth.dependencies import get_current_user
router=APIRouter()


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user=await get_current_user(form_data.username)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    return {"access_token": user.email, "token_type": "bearer"}

    
@router.post("/me")
def get_user_me(token: str = Depends(get_current_user)):
    pass

@router.post("/register")
def register():
    pass

@router.get("/reset-password")
def reset_password():
    pass