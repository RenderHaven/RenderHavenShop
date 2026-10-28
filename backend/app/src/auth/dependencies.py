from fastapi import Depends, HTTPException,status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from backend.app.src.auth.service import AuthService
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")



async def decode_token(token: str):
    # Implement your token decoding logic here
    pass

async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = await decode_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user