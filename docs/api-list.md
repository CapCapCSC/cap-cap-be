# API List – Dự án Cạp Cạp

Tài liệu liệt kê toàn bộ endpoint backend của hệ thống "Cạp Cạp", phân nhóm rõ ràng theo resource.  
Tất cả API đều đi qua prefix `/api`.

---

## Authorization

Một số endpoint yêu cầu xác thực (authentication) hoặc phân quyền (authorization).  
Các quy tắc chung:

- **[Auth]**: Yêu cầu người dùng đã đăng nhập (có access token hợp lệ).
- **[Admin]**: Chỉ admin mới được phép thực hiện.
- **[Public]**: Ai cũng có thể truy cập.

### Ví dụ chú thích trong tài liệu:

- `POST /api/foods` **[Auth][Admin]** – Chỉ admin mới được tạo món ăn mới.
- `GET /api/foods` **[Public]** – Ai cũng có thể xem danh sách món ăn.
- `POST /api/users/:id/badges` **[Auth][Admin]** – Chỉ admin mới gán badge cho user.
- `POST /api/quizzes/:id/submit` **[Auth]** – Người dùng đã đăng nhập mới được nộp quiz.

### Cách ghi chú trong từng API:

### `POST /api/foods` Tạo food mới **[Auth][Admin]**

### `GET /api/foods` Lấy danh sách tất cả các món ăn **[Public]**

> **Lưu ý:**
>
> - Nếu không ghi chú, mặc định là **[Auth]** (yêu cầu đăng nhập).
> - Các endpoint nhạy cảm (tạo, sửa, xóa) nên yêu cầu quyền admin.
> - Các endpoint chỉ đọc (GET) thường có thể để public, tùy vào nghiệp vụ.

---

## Authentication

### `POST /api/auth/register` Đăng ký tài khoản mới

**Request:**

```json
{
    "username": "newuser",
    "email": "newuser@gmail.com",
    "password": "password"
}
```

**Validation Rules:**

- `username`: Required, string, max length 50.
- `email`: Required, valid email format.
- `password`: Required, string, min length 6.

**Response:**

```json
{
    "message": "Register successful",
    "user": {
        "_id": "...",
        "username": "newuser",
        "email": "newuser@gmail.com"
    }
}
```

### `POST /api/auth/login` Đăng nhập

**Request:**

```json
{
    "email": "newuser@gmail.com",
    "password": "password"
}
```

**Validation Rules:**

- `email`: Required, valid email format.
- `password`: Required, string.

**Response:**

```json
{
    "message": "Login successful",
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "user": {
        "_id": "...",
        "username": "newuser",
        "email": "newuser@gmail.com"
    }
}
```

### `POST /api/auth/refresh-token` Làm mới access token

**Request:**

```json
{
    "refreshToken": "jwt-refresh-token"
}
```

**Response:**

```json
{
    "accessToken": "new-jwt-access-token"
}
```

### `POST /api/auth/logout` Đăng xuất

**Request:**

```json
{
    "refreshToken": "jwt-refresh-token"
}
```

**Response:**

```json
{
    "message": "Logout successful"
}
```

---

## User

### `POST /api/users` Tạo user mới

**Request:**

```json
{
    "username": "username",
    "email": "user@gmail.com",
    "password": "password",
    "role": "user"
}
```

**Response:**

```json
{
    "message": "User created",
    "user": {
        "_id": "...",
        "username": "username",
        "email": "user@gmail.com",
        "role": "user"
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
    "username": "username",
    "email": "user@gmail.com"
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
    {
    "name": "food name",
    "description": "food description",
    "ingredients": ["ingredient 1", "ingredient 2"],
    "imgUrl": "https://example.com/food.jpg",
    "tags": ["foodTagId1", "foodTagId2"]
}
}
```

**Response:**

```json
{
    "message": "Food created",
    "food": { "_id": "...", "name": "food", "ingredients": ["ingredient 1"] }
}
```

### `GET /api/foods/` Lấy danh sách tất cả các món ăn

**Query Parameters:**

- `page`: Optional, integer, default is 1.
- `limit`: Optional, integer, default is 10.
- `tags`: Optional, comma-separated tag IDs for filtering.

**Response:**

```json
{
    "data": [
        {
            "name": "food name 1",
            "description": "food description 1",
            "ingredients": ["ingredient 1", "ingredient 2"],
            "imgUrl": "https://example.com/food1.jpg",
            "tags": ["foodTagId1", "foodTagId2"]
        },
        {
            "name": "food name 2",
            "description": "food description 2",
            "ingredients": ["ingredient 1", "ingredient 2"],
            "imgUrl": "https://example.com/food2.jpg",
            "tags": ["foodTagId1", "foodTagId2"]
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 20
    }
}
```

### `GET /api/foods/:id` Lấy thông tin chi tiết của một món ăn

**Response:**

```json
{
    "name": "food name",
    "description": "food description",
    "ingredients": ["ingredient 1", "ingredient 2"],
    "imgUrl": "https://example.com/food.jpg",
    "tags": ["foodTagId1", "foodTagId2"]
}
```

### `PUT /api/foods/:id` Cập nhật thông tin món ăn

**Request:**

```json
{
    "name": "food name",
    "description": "food description",
    "ingredients": ["ingredient 1", "ingredient 2"],
    "imgUrl": "https://example.com/food.jpg",
    "tags": ["foodTagId1", "foodTagId2"]
}
```

**Response:**

```json
{
    "message": "Food updated",
    "food": {
        "_id": "...",
        "name": "food name",
        "description": "food description",
        "ingredients": ["ingredient 1", "ingredient 2"],
        "imgUrl": "https://example.com/food.jpg",
        "tags": ["foodTagId1", "foodTagId2"]
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

---

## Food Tag

### `POST /api/foodtags` Tạo tag món ăn mới

**Request:**

```json
{
    "name": "food tag",
    "color": "#008000"
}
```

**Response:**

```json
{
    "message": "Food tag created",
    "foodTag": {
        "_id": "...",
        "name": "food tag",
        "color": "#008000"
    }
}
```

### `GET /api/foodtags` Lấy danh sách tất cả tag món ăn

**Response:**

```json
[
    {
        "_id": "...",
        "name": "food tag",
        "color": "#008000"
    },
    {
        "_id": "...",
        "name": "food tag",
        "color": "#000080"
    }
]
```

### `GET /api/foodtags/:id` Lấy thông tin chi tiết một tag

**Response:**

```json
{
    "_id": "...",
    "name": "food tag",
    "color": "#008000"
}
```

### `PUT /api/foodtags/:id` Cập nhật thông tin tag

**Request:**

```json
{
    "name": "food tag",
    "color": "#008000"
}
```

**Response:**

```json
{
    "message": "Food tag updated",
    "foodTag": {
        "_id": "...",
        "name": "food tag",
        "color": "#008000"
    }
}
```

### `DELETE /api/foodtags/:id` Xóa tag món ăn

**Response:**

```json
{
    "message": "Food tag deleted"
}
```

---

## Restaurant

### `POST /api/restaurants` Tạo nhà hàng mới

**Request:**

```json
{
    "name": "restaurant name",
    "imageUrl": "https://example.com/restaurant.jpg",
    "district": "Quận 1",
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
        "district": "Quận 1",
        "locationUrl": "https://maps.example.com/restaurant",
        "menu": [
            {
                "food": {
                    "_id": "...",
                    "name": "food name",
                    "description": "food description",
                    "ingredients": ["ingredient 1", "ingredient 2"],
                    "imgUrl": "https://example.com/food.jpg",
                    "tags": ["foodTagId1", "foodTagId2"]
                },
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
        "district": "Quận 1",
        "locationUrl": "https://maps.example.com/restaurant",
        "menu": [
            {
                "food": {
                    "_id": "...",
                    "name": "food name",
                    "description": "food description",
                    "ingredients": ["ingredient 1", "ingredient 2"],
                    "imgUrl": "https://example.com/food.jpg",
                    "tags": ["foodTagId1", "foodTagId2"]
                },
                "price": 50000
            }
        ]
    }
]
```

### `GET /api/restaurants/random` Lấy ngẫu nhiên 3 nhà hàng theo district **[Public]**

**Query Parameters:**

- `district`: Required, tên quận/huyện cần lấy nhà hàng.

**Ví dụ:**

```
GET /api/restaurants/random?district=Quận 1
```

**Response:**

```json
{
    "data": [
        {
            "_id": "restaurantId1",
            "name": "Nhà hàng A",
            "imageUrl": "https://example.com/restaurantA.jpg",
            "district": "Quận 1",
            "locationUrl": "https://maps.example.com/restaurantA",
            "menu": [
                {
                    "food": {
                        "_id": "foodId1",
                        "name": "Phở bò",
                        "description": "Phở bò là món ăn truyền thống...",
                        "ingredients": ["Bánh phở", "Thịt bò", "Hành lá"],
                        "imgUrl": "https://example.com/phobo.jpg",
                        "tags": ["661f3b555555555555555555"]
                    },
                    "price": 50000
                }
            ]
        }
        // ... 2 nhà hàng khác ...
    ]
}
```

**Ghi chú:**

- Nếu district không có đủ 3 nhà hàng, trả về tối đa số lượng hiện có.
- Nếu không có nhà hàng nào ở district đó, trả về `data: []`.

### `GET /api/restaurants/:id` Lấy thông tin chi tiết nhà hàng

**Response:**

```json
{
    "_id": "...",
    "name": "restaurant name",
    "imageUrl": "https://example.com/restaurant.jpg",
    "district": "Quận 1",
    "locationUrl": "https://maps.example.com/restaurant",
    "menu": [
        {
            "food": {
                "_id": "...",
                "name": "food name",
                "description": "food description",
                "ingredients": ["ingredient 1", "ingredient 2"],
                "imgUrl": "https://example.com/food.jpg",
                "tags": ["foodTagId1", "foodTagId2"]
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
    "district": "Quận 1",
    "locationUrl": "https://maps.example.com/updated",
    "menu": [
        {
            "food": {
                "_id": "...",
                "name": "food name",
                "description": "food description",
                "ingredients": ["ingredient 1", "ingredient 2"],
                "imgUrl": "https://example.com/food.jpg",
                "tags": ["foodTagId1", "foodTagId2"]
            },
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
        "district": "Quận 1",
        "locationUrl": "https://maps.example.com/updated",
        "menu": [
            {
                "food": {
                    "_id": "...",
                    "name": "food name",
                    "description": "food description",
                    "ingredients": ["ingredient 1", "ingredient 2"],
                    "imgUrl": "https://example.com/food.jpg",
                    "tags": ["foodTagId1", "foodTagId2"]
                },
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

---

## Questions

### `POST /api/questions` Tạo câu hỏi mới

**Request:**

```json
{
    "content": "Phở bò là đặc sản của vùng nào?",
    "correctAnswer": ["Miền Bắc"],
    "incorrectAnswer": ["Miền Nam", "Miền Trung"],
    "relatedFood": "foodObjectId"
}
```

**Response:**

```json
{
    "message": "Question created",
    "question": {
        "_id": "...",
        "content": "Phở bò là đặc sản của vùng nào?",
        "correctAnswer": ["Miền Bắc"],
        "incorrectAnswer": ["Miền Nam", "Miền Trung"],
        "relatedFood": "foodObjectId"
    }
}
```

### `GET /api/questions` Lấy danh sách tất cả câu hỏi

**Response:**

```json
[
    {
        "_id": "...",
        "content": "Phở bò là đặc sản của vùng nào?",
        "correctAnswer": ["Miền Bắc"],
        "incorrectAnswer": ["Miền Nam", "Miền Trung"],
        "relatedFood": "foodObjectId"
    }
]
```

### `GET /api/questions/:id` Lấy thông tin chi tiết một câu hỏi

**Response:**

```json
{
    "_id": "...",
    "content": "Phở bò là đặc sản của vùng nào?",
    "correctAnswer": ["Miền Bắc"],
    "incorrectAnswer": ["Miền Nam", "Miền Trung"],
    "relatedFood": "foodObjectId"
}
```

### `PUT /api/questions/:id` Cập nhật thông tin câu hỏi

**Request:**

```json
{
    "content": "Phở bò là đặc sản của vùng nào?",
    "correctAnswer": ["Miền Bắc"],
    "incorrectAnswer": ["Miền Nam", "Miền Trung"],
    "relatedFood": "foodObjectId"
}
```

**Response:**

```json
{
    "message": "Question updated",
    "question": {
        "_id": "...",
        "content": "Phở bò là đặc sản của vùng nào?",
        "correctAnswer": ["Miền Bắc"],
        "incorrectAnswer": ["Miền Nam", "Miền Trung"],
        "relatedFood": "foodObjectId"
    }
}
```

### `DELETE /api/questions/:id` Xóa câu hỏi

**Response:**

```json
{
    "message": "Question deleted"
}
```

---

## Quiz

### `POST /api/quizzes` Tạo quiz mới

**Request:**

```json
{
    "name": "Quiz Ẩm thực Việt Nam",
    "description": "Kiểm tra kiến thức về các món ăn Việt.",
    "imageUrl": "https://example.com/quiz.jpg",
    "questions": ["questionObjectId1", "questionObjectId2"],
    "validUntil": "2025-12-31T23:59:59.000Z"
}
```

**Response:**

```json
{
    "message": "Quiz created",
    "quiz": {
        "_id": "...",
        "name": "Quiz Ẩm thực Việt Nam",
        "description": "Kiểm tra kiến thức về các món ăn Việt.",
        "imageUrl": "https://example.com/quiz.jpg",
        "questions": ["questionObjectId1", "questionObjectId2"],
        "validUntil": "2025-12-31T23:59:59.000Z"
    }
}
```

### `GET /api/quizzes` Lấy danh sách tất cả quiz

**Response:**

```json
[
    {
        "_id": "...",
        "name": "Quiz Ẩm thực Việt Nam",
        "description": "Kiểm tra kiến thức về các món ăn Việt.",
        "imageUrl": "https://example.com/quiz.jpg",
        "questions": ["questionObjectId1", "questionObjectId2"],
        "validUntil": "2025-12-31T23:59:59.000Z"
    }
]
```

### `GET /api/quizzes/:id` Lấy thông tin chi tiết quiz

**Response:**

```json
{
    "_id": "...",
    "name": "Quiz Ẩm thực Việt Nam",
    "description": "Kiểm tra kiến thức về các món ăn Việt.",
    "imageUrl": "https://example.com/quiz.jpg",
    "questions": ["questionObjectId1", "questionObjectId2"],
    "validUntil": "2025-12-31T23:59:59.000Z"
}
```

### `PUT /api/quizzes/:id` Cập nhật thông tin quiz

**Request:**

```json
{
    "name": "Quiz Ẩm thực Việt Nam",
    "description": "Kiểm tra kiến thức về các món ăn Việt.",
    "imageUrl": "https://example.com/quiz.jpg",
    "questions": ["questionObjectId1", "questionObjectId2"],
    "validUntil": "2025-12-31T23:59:59.000Z"
}
```

**Response:**

```json
{
    "message": "Quiz updated",
    "quiz": {
        "_id": "...",
        "name": "Quiz Ẩm thực Việt Nam",
        "description": "Kiểm tra kiến thức về các món ăn Việt.",
        "imageUrl": "https://example.com/quiz.jpg",
        "questions": ["questionObjectId1", "questionObjectId2"],
        "validUntil": "2025-12-31T23:59:59.000Z"
    }
}
```

### `DELETE /api/quizzes/:id` Xóa quiz

**Response:**

```json
{
    "message": "Quiz deleted"
}
```

---

## Badge

### `POST /api/badges` Tạo badge mới

**Request:**

```json
{
    "name": "Chuyên gia ẩm thực",
    "iconUrl": "https://example.com/badge.png"
}
```

**Response:**

```json
{
    "message": "Badge created",
    "badge": {
        "_id": "...",
        "name": "Chuyên gia ẩm thực",
        "iconUrl": "https://example.com/badge.png"
    }
}
```

### `GET /api/badges` Lấy danh sách tất cả badge

**Response:**

```json
[
    {
        "_id": "...",
        "name": "Chuyên gia ẩm thực",
        "iconUrl": "https://example.com/badge.png"
    },
    {
        "_id": "...",
        "name": "Người mới",
        "iconUrl": "https://example.com/badge2.png"
    }
]
```

### `GET /api/badges/:id` Lấy thông tin chi tiết badge

**Response:**

```json
{
    "_id": "...",
    "name": "Chuyên gia ẩm thực",
    "iconUrl": "https://example.com/badge.png"
}
```

### `PUT /api/badges/:id` Cập nhật thông tin badge

**Request:**

```json
{
    "name": "Chuyên gia ẩm thực cấp cao",
    "iconUrl": "https://example.com/badge-updated.png"
}
```

**Response:**

```json
{
    "message": "Badge updated",
    "badge": {
        "_id": "...",
        "name": "Chuyên gia ẩm thực cấp cao",
        "iconUrl": "https://example.com/badge-updated.png"
    }
}
```

### `DELETE /api/badges/:id` Xóa badge

**Response:**

```json
{
    "message": "Badge deleted"
}
```

---

## Voucher

### `POST /api/vouchers` Tạo voucher mới

**Request:**

```json
{
    "name": "Giảm giá 10%",
    "validUntil": "2025-12-31T23:59:59.000Z",
    "applicableRestaurants": ["restaurantObjectId1", "restaurantObjectId2"],
    "discountValue": 10
}
```

**Response:**

```json
{
    "message": "Voucher created",
    "voucher": {
        "_id": "...",
        "name": "Giảm giá 10%",
        "validUntil": "2025-12-31T23:59:59.000Z",
        "applicableRestaurants": ["restaurantObjectId1", "restaurantObjectId2"],
        "discountValue": 10,
        "used": false
    }
}
```

### `GET /api/vouchers` Lấy danh sách tất cả voucher

**Response:**

```json
[
    {
        "_id": "...",
        "name": "Giảm giá 10%",
        "validUntil": "2025-12-31T23:59:59.000Z",
        "applicableRestaurants": [
            {
                "_id": "restaurantObjectId1",
                "name": "Nhà hàng A"
            }
        ],
        "discountValue": 10,
        "used": false
    }
]
```

### `GET /api/vouchers/:id` Lấy thông tin chi tiết voucher

**Response:**

```json
{
    "_id": "...",
    "name": "Giảm giá 10%",
    "validUntil": "2025-12-31T23:59:59.000Z",
    "applicableRestaurants": [
        {
            "_id": "restaurantObjectId1",
            "name": "Nhà hàng A"
        }
    ],
    "discountValue": 10,
    "used": false
}
```

### `PUT /api/vouchers/:id` Cập nhật thông tin voucher

**Request:**

```json
{
    "name": "Giảm giá 20%",
    "validUntil": "2026-01-01T23:59:59.000Z",
    "applicableRestaurants": ["restaurantObjectId3"],
    "discountValue": 20,
    "used": true
}
```

**Response:**

```json
{
    "message": "Voucher updated",
    "voucher": {
        "_id": "...",
        "name": "Giảm giá 20%",
        "validUntil": "2026-01-01T23:59:59.000Z",
        "applicableRestaurants": ["restaurantObjectId3"],
        "discountValue": 20,
        "used": true
    }
}
```

### `DELETE /api/vouchers/:id` Xóa voucher

**Response:**

```json
{
    "message": "Voucher deleted"
}
```

---

## Error Response

Tất cả API khi gặp lỗi sẽ trả về response với cấu trúc sau:

```json
{
    "error": "Error",
    "message": "Description",
    "status": 400
}
```

**Validation Error Example (422 – Unprocessable Entity):**

```json
{
    "error": "ValidationError",
    "message": "Password must be at least 6 characters.",
    "status": 422
}
```

### Ví dụ lỗi thường gặp

#### 400 – Bad Request

```json
{
    "error": "BadRequest",
    "message": "Email has existed.",
    "status": 400
}
```

#### 401 – Unauthorized

```json
{
    "error": "Unauthorized",
    "message": "You need to log in to perform this action.",
    "status": 401
}
```

#### 403 – Forbidden

```json
{
    "error": "Forbidden",
    "message": "You do not have permission to access this.",
    "status": 403
}
```

#### 404 – Not Found

```json
{
    "error": "NotFound",
    "message": "Nothing to be found.",
    "status": 404
}
```

#### 500 – Internal Server Error

```json
{
    "error": "InternalServerError",
    "message": "There are some internal server errors. Please try again later.",
    "status": 500
}
```

---

## Pagination, Filtering, Searching

Các API trả về danh sách (GET all) hỗ trợ các query parameters sau để phân trang, lọc và tìm kiếm:

### Pagination

- `page`: Số trang (bắt đầu từ 1). Mặc định: 1
- `limit`: Số phần tử mỗi trang. Mặc định: 10

**Ví dụ:**

```
GET /api/foods?page=2&limit=5
```

**Response:**

```json
{
    "data": [
        { "name": "food_06", ... },
        { "name": "food_07", ... }
    ],
    "pagination": {
        "page": 2,
        "limit": 5,
        "total": 20
    }
}
```

**Ví dụ:**

```
GET /api/foods?tags=661f3b...e1,661f3b...e2
```

### Filtering

- Có thể lọc theo các trường cụ thể, ví dụ:
    - `/api/foods?name=pizza`
    - `/api/foods?tags=tagId1,tagId2` _(lọc các món ăn có chứa ít nhất một trong các tag này)_
    - `/api/restaurants?name=Nhà hàng A`
    - `/api/vouchers?used=false`

### Searching

- Có thể tìm kiếm toàn văn với tham số `search`:
    - `/api/foods?search=pizza`
    - `/api/restaurants?search=quán nướng`

---

> **Lưu ý:**
>
> - Các API trả về danh sách nên trả về cả thông tin phân trang (`pagination`) để client dễ xử lý.
> - Các trường filter/search có thể thay đổi tùy resource, hãy ghi rõ trong tài liệu chi tiết nếu cần.

---

## Relationship/Action APIs

### Gán badge cho user

#### `POST /api/users/:id/badges` Gán badge cho user

**Request:**

```json
{
    "badgeId": "badgeObjectId"
}
```

**Response:**

```json
{
    "message": "Badge assigned to user",
    "user": {
        "_id": "...",
        "badges": ["badgeObjectId", "..."]
    }
}
```

---

### Gán voucher cho user

#### `POST /api/users/:id/vouchers` Gán voucher cho user

**Request:**

```json
{
    "voucherId": "voucherObjectId"
}
```

**Response:**

```json
{
    "message": "Voucher assigned to user",
    "user": {
        "_id": "...",
        "vouchers": ["voucherObjectId", "..."]
    }
}
```

### Tham gia quiz

#### `POST /api/quizzes/:id/submit` Nộp kết quả quiz

**Request:**

```json
{
    "userId": "userObjectId",
    "answers": [
        { "questionId": "questionObjectId1", "answer": ["Pizza"] },
        { "questionId": "questionObjectId2", "answer": ["Pho"] }
    ]
}
```

**Response:**

```json
{
    "message": "Quiz submitted",
    "result": {
        "score": 8,
        "total": 10,
        "correctAnswers": [
            { "questionId": "questionObjectId1", "isCorrect": true },
            { "questionId": "questionObjectId2", "isCorrect": false }
        ]
    }
}
```

---

## Versioning

All endpoints should include a version prefix for future-proofing. For example:

- `/api/v1/auth/register`
- `/api/v1/foods`

---

## Security Notes

- All sensitive data (e.g., passwords) must be hashed before storage.
- Access tokens should expire after a short duration (e.g., 15 minutes).
- Refresh tokens should be securely stored and rotated periodically.

---

## Testing

Developers can use the following tools to test the API:

- **Postman**: Import the API collection for quick testing.
- **Mock Server**: Use a mock server to simulate API responses without affecting production.

---
