from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
import uuid

router = APIRouter(prefix="/products", tags=["products"])

class Product(BaseModel):
    id: str
    name: str
    price: float
    category: str
    stock: int
    description: Optional[str] = None
    image_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

# Mock data
MOCK_PRODUCTS = [
    Product(
        id=str(uuid.uuid4()),
        name="Μήλα Φίρικα",
        price=1.50,
        category="Φρούτα",
        stock=100,
        description="Φρέσκα μήλα από τη Φίρικα",
        image_url="/images/apples.jpg",
        created_at=datetime.now(),
        updated_at=datetime.now()
    ),
    Product(
        id=str(uuid.uuid4()),
        name="Ψωμί Πολύσπορο",
        price=1.20,
        category="Αρτοσκευάσματα",
        stock=50,
        description="Φρέσκο ψωμί με 5 σπόρους",
        created_at=datetime.now(),
        updated_at=datetime.now()
    ),
]

@router.get("/", response_model=List[Product])
async def get_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search by name"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Get all products with filtering and pagination"""
    products = MOCK_PRODUCTS
    
    if category:
        products = [p for p in products if p.category == category]
    if search:
        products = [p for p in products if search.lower() in p.name.lower()]
    
    return products[offset:offset + limit]

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get single product by ID"""
    product = next((p for p in MOCK_PRODUCTS if p.id == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
