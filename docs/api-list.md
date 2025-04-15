# API List – Dự án Cạp Cạp

Tài liệu liệt kê toàn bộ endpoint backend của hệ thống "Cạp Cạp", phân nhóm rõ ràng theo resource.  
Tất cả API đều đi qua prefix `/api`.

## Authentication

---

## User

### `POST /api/users` Tạo user mới

**Request:**

```json
{
    "username": "username",
    "email": "user@gmail.com",
    "password": "password"
}
```

**Response:**

```json
{
    "message": "User created",
    "user": {
        "_id": "...",
        "username": "username",
        "email": "user@gmail.com"
    }
}
```

### `GET /api/users/:id` Lấy thông tin user + voucher, badge

**Response:**

```json
{
    "_id": "...",
    "username": "username",
    "vouchers": ["..."],
    "badges": ["..."]
}
```

### `PUT /api/users/:id` Cập nhật thông tin user

**Request:**

```json
{
    "username": "new_username",
    "email": "new_email@gmail.com"
}
```

**Response:**

```json
{
    "message": "User updated",
    "user": {
        "_id": "...",
        "username": "new_username",
        "email": "new_email@gmail.com"
    }
}
```

### `DELETE /api/users/:id` Xóa user

**Response:**

```json
{
    "message": "User deleted"
}
```

---

## Food

### `POST /api/foods` Tạo food mới

**Request:**

```json
{
    "name": "food name",
    "description": "food description",
    "imgUrl": "https://example.com/food.jpg",
    "tags": ["..."]
}
```

**Response:**

```json
{
    "message": "Food created",
    "food": { "_id": "...", "name": "food" }
}
```

### `GET /api/foods/` Lấy danh sách tất cả các món ăn

**Response:**

```json
{
    {
        "name": "food_01",
        "description": "food_01 description",
        "imgUrl": "https://example.com/food_01.jpg",
        "tags": ["..."]
    },
    {
        "name": "food_02",
        "description": "food_02 description",
        "imgUrl": "https://example.com/food_02.jpg",
        "tags": ["..."]
    },
}
```

### `GET /api/foods/:id` Lấy thông tin chi tiết của một món ăn

**Response:**

```json
{
    "name": "food",
    "description": "food description",
    "imgUrl": "https://example.com/food.jpg",
    "tags": ["..."]
}
```

### `PUT /api/foods/:id` Cập nhật thông tin món ăn

**Request:**

```json
{
    "name": "Updated Food Name",
    "description": "Updated description",
    "imgUrl": "https://example.com/updated.jpg",
    "tags": ["..."]
}
```

**Response:**

```json
{
    "message": "Food updated",
    "food": {
        "_id": "...",
        "name": "Updated Food Name",
        "description": "Updated description",
        "imgUrl": "https://example.com/updated.jpg",
        "tags": ["..."]
    }
}
```

### `DELETE /api/foods/:id` Xóa món ăn

**Response:**

```json
{
    "message": "Food deleted"
}
```

## Restaurant

### `POST /api/restaurants` Tạo nhà hàng mới

**Request:**

```json
{
    "name": "restaurant name",
    "imageUrl": "https://example.com/restaurant.jpg",
    "locationUrl": "https://maps.example.com/restaurant",
    "menu": [
        {
            "food": "foodObjectId",
            "price": 50000
        }
    ]
}
```

**Response:**

```json
{
    "message": "Restaurant created",
    "restaurant": {
        "_id": "...",
        "name": "restaurant name",
        "imageUrl": "https://example.com/restaurant.jpg",
        "locationUrl": "https://maps.example.com/restaurant",
        "menu": [
            {
                "food": "foodObjectId",
                "price": 50000
            }
        ]
    }
}
```

### `GET /api/restaurants` Lấy danh sách tất cả nhà hàng

**Response:**

```json
[
    {
        "_id": "...",
        "name": "name",
        "imageUrl": "https://example.com/restaurant.jpg",
        "locationUrl": "https://maps.example.com/restaurant",
        "menu": [
            {
                "food": {
                    "_id": "...",
                    "name": "food name",
                    "description": "food description",
                    "imgUrl": "https://example.com/food.jpg"
                },
                "price": 50000
            }
        ]
    }
]
```

### `GET /api/restaurants/:id` Lấy thông tin chi tiết nhà hàng

**Response:**

```json
{
    "_id": "...",
    "name": "restaurant name",
    "imageUrl": "https://example.com/restaurant.jpg",
    "locationUrl": "https://maps.example.com/restaurant",
    "menu": [
        {
            "food": {
                "_id": "...",
                "name": "food name",
                "description": "food description",
                "imgUrl": "https://example.com/food.jpg"
            },
            "price": 50000
        }
    ]
}
```

### `PUT /api/restaurants/:id` Cập nhật thông tin nhà hàng

**Request:**

```json
{
    "name": "Updated restaurant name",
    "imageUrl": "https://example.com/updated.jpg",
    "locationUrl": "https://maps.example.com/updated",
    "menu": [
        {
            "food": "foodObjectId",
            "price": 60000
        }
    ]
}
```

**Response:**

```json
{
    "message": "Restaurant updated",
    "restaurant": {
        "_id": "...",
        "name": "Updated restaurant name",
        "imageUrl": "https://example.com/updated.jpg",
        "locationUrl": "https://maps.example.com/updated",
        "menu": [
            {
                "food": "foodObjectId",
                "price": 60000
            }
        ]
    }
}
```

### `DELETE /api/restaurants/:id` Xóa nhà hàng

**Response:**

```json
{
    "message": "Restaurant deleted"
}
```
