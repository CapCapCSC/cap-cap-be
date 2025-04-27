# API List – Dự án Cạp Cạp

Tài liệu liệt kê toàn bộ endpoint backend của hệ thống "Cạp Cạp", phân nhóm rõ ràng theo resource.  
Tất cả API đều đi qua prefix `/api`.

Có thể một số phần đã outdated. Vui lòng xem API documentation.

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

### `POST /api/auth/register` Đăng ký tài khoản mới **[Public]**

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
    "message": "Register successfully",
    "user": {
        "_id": "...",
        "username": "newuser",
        "email": "newuser@gmail.com"
    }
}
```

### `POST /api/auth/login` Đăng nhập **[Public]**

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
    "message": "Login successfully",
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "user": {
        "_id": "...",
        "username": "newuser",
        "email": "newuser@gmail.com"
    }
}
```

### `POST /api/auth/refresh-token` Làm mới access token **[Auth]**

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

### `POST /api/auth/logout` Đăng xuất **[Auth]**

**Request:**

```json
{
    "refreshToken": "jwt-refresh-token"
}
```

**Response:**

```json
{
    "message": "Logout successfully"
}
```

---

### `POST /api/auth/forgot-password` Quên mật khẩu **[Auth]**

**Request:**

```json
{
    "email": "example@gmail.com"
}
```

**Response:**

```json
{
    "message": "Password reset email sent successfully"
}
```

---

### `POST /api/auth/reset-password` Đặt lại mật khẩu **[Auth]**

**Request:**

```json
{
    "resetToken": "jwt-reset-token",
    "newPassword": "example-password"
}
```

**Response:**

```json
{
    "message": "Password reset successfully"
}
```

---

## User

### `POST /api/users` Tạo user mới **[Auth][Admin]**

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

### `GET /api/users/:id` Lấy thông tin user + voucher, badge **[Auth]**

**Response:**

```json
{
    "_id": "...",
    "username": "username",
    "vouchers": ["..."],
    "badges": ["..."]
}
```

### `PUT /api/users/:id` Cập nhật thông tin user **[Auth]**

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

### `DELETE /api/users/:id` Xóa user **[Auth][Admin]**

**Response:**

```json
{
    "message": "User deleted"
}
```

### `POST /api/users/:id/badge` Thêm badge cho user **[Auth][Admin]**

**Request:**

```json
{
    "badgeId": "badgeObjectId"
}
```

**Response:**

```json
{
    "message": "Badge added to user",
    "user": {
        "_id": "...",
        "badges": ["badgeObjectId", "..."]
    }
}
```

### `POST /api/users/:id/voucher` Thêm voucher cho user **[Auth][Admin]**

**Request:**

```json
{
    "voucherId": "voucherObjectId"
}
```

**Response:**

```json
{
    "message": "Voucher added to user",
    "user": {
        "_id": "...",
        "vouchers": ["voucherObjectId", "..."]
    }
}
```

---

## Food

### `POST /api/foods` Tạo food mới **[Auth][Admin]**

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

### `GET /api/foods/` Lấy danh sách tất cả các món ăn **[Public]**

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
            "tags": ["foodTag1", "foodTag2"]
        },
        {
            "name": "food name 2",
            "description": "food description 2",
            "ingredients": ["ingredient 1", "ingredient 2"],
            "imgUrl": "https://example.com/food2.jpg",
            "tags": ["foodTag1", "foodTag2"]
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 20
    }
}
```

### `GET /api/foods/random` Lấy món ăn ngẫu nhiên **[Public]**

**Response:**

```json
{
    "food": {
        "_id": "...",
        "name": "Phở bò",
        "description": "Phở bò là món ăn truyền thống...",
        "ingredients": ["Bánh phở", "Thịt bò", "Hành lá"],
        "imgUrl": "https://example.com/phobo.jpg",
        "tags": ["661f3b555555555555555555"]
    },
    "restaurants": [
        {
            "_id": "...",
            "name": "Nhà hàng A",
            "price": 50000
        }
    ]
}
```

### `GET /api/foods/:id` Lấy thông tin chi tiết của một món ăn **[Public]**

**Response:**

```json
{
    "name": "food name",
    "description": "food description",
    "ingredients": ["ingredient 1", "ingredient 2"],
    "imgUrl": "https://example.com/food.jpg",
    "tags": ["foodTag1", "foodTag2"]
}
```

### `PUT /api/foods/:id` Cập nhật thông tin món ăn **[Auth][Admin]**

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

### `DELETE /api/foods/:id` Xóa món ăn **[Auth][Admin]**

**Response:**

```json
{
    "message": "Food deleted"
}
```

---

## Food Tag

### `POST /api/foodtags` Tạo tag món ăn mới **[Auth][Admin]**

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

### `GET /api/foodtags` Lấy danh sách tất cả tag món ăn **[Public]**

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

### `GET /api/foodtags/:id` Lấy thông tin chi tiết một tag **[Public]**

**Response:**

```json
{
    "_id": "...",
    "name": "food tag",
    "color": "#008000"
}
```

### `PUT /api/foodtags/:id` Cập nhật thông tin tag **[Auth][Admin]**

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

### `DELETE /api/foodtags/:id` Xóa tag món ăn **[Auth][Admin]**

**Response:**

```json
{
    "message": "Food tag deleted"
}
```

---

## Restaurant

### `POST /api/restaurants` Tạo nhà hàng mới **[Auth][Admin]**

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

### `GET /api/restaurants` Lấy danh sách tất cả nhà hàng **[Public]**

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

### `GET /api/restaurants/random` Lấy 3 nhà hàng ngẫu nhiên **[Public]**

**Query Parameters:**

- `district`: Optional, string, filter by district

**Response:**

```json
{
    "data": [
        {
            "_id": "...",
            "name": "Nhà hàng A",
            "imageUrl": "https://example.com/restaurantA.jpg",
            "district": "Quận 1",
            "locationUrl": "https://maps.example.com/restaurantA",
            "menu": [
                {
                    "food": {
                        "_id": "...",
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
    ]
}
```

### `GET /api/restaurants/:id` Lấy thông tin chi tiết nhà hàng **[Public]**

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

### `PUT /api/restaurants/:id` Cập nhật thông tin nhà hàng **[Auth][Admin]**

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

### `DELETE /api/restaurants/:id` Xóa nhà hàng **[Auth][Admin]**

**Response:**

```json
{
    "message": "Restaurant deleted"
}
```

---

## Questions

### `POST /api/questions` Tạo câu hỏi mới **[Auth][Admin]**

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

### `GET /api/questions` Lấy danh sách tất cả câu hỏi **[Auth][Admin]**

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

### `GET /api/questions/:id` Lấy thông tin chi tiết một câu hỏi **[Auth][Admin]**

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

### `PUT /api/questions/:id` Cập nhật thông tin câu hỏi **[Auth][Admin]**

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

### `DELETE /api/questions/:id` Xóa câu hỏi **[Auth][Admin]**

**Response:**

```json
{
    "message": "Question deleted"
}
```

---

## Quiz

### `POST /api/quizzes` Tạo quiz mới **[Auth][Admin]**

**Request:**

```json
{
    "name": "Quiz Ẩm thực Việt Nam",
    "description": "Kiểm tra kiến thức về các món ăn Việt.",
    "imageUrl": "https://example.com/quiz.jpg",
    "questions": ["questionObjectId1", "questionObjectId2"],
    "timeLimit": 300,
    "passingScore": 70,
    "validUntil": "2025-12-31T23:59:59.000Z",
    "rewardBadge": "badgeObjectId",
    "rewardVoucher": "voucherObjectId"
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
        "timeLimit": 300,
        "passingScore": 70,
        "validUntil": "2025-12-31T23:59:59.000Z",
        "rewardBadge": "badgeObjectId",
        "rewardVoucher": "voucherObjectId",
        "isActive": true,
        "statistics": {
            "totalAttempts": 0,
            "averageScore": 0,
            "completionRate": 0,
            "averageTimeSpent": 0
        }
    }
}
```

### `GET /api/quizzes` Lấy danh sách tất cả quiz **[Public]**

**Response:**

```json
{
    "data": [
        {
            "_id": "...",
            "name": "Quiz Ẩm thực Việt Nam",
            "description": "Kiểm tra kiến thức về các món ăn Việt.",
            "imageUrl": "https://example.com/quiz.jpg",
            "questions": ["questionObjectId1", "questionObjectId2"],
            "timeLimit": 300,
            "passingScore": 70,
            "validUntil": "2025-12-31T23:59:59.000Z",
            "isActive": true,
            "statistics": {
                "totalAttempts": 10,
                "averageScore": 75.5,
                "completionRate": 90,
                "averageTimeSpent": 300
            }
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 20
    }
}
```

### `GET /api/quizzes/:id` Lấy thông tin chi tiết quiz **[Public]**

**Response:**

```json
{
    "_id": "...",
    "name": "Quiz Ẩm thực Việt Nam",
    "description": "Kiểm tra kiến thức về các món ăn Việt.",
    "imageUrl": "https://example.com/quiz.jpg",
    "questions": ["questionObjectId1", "questionObjectId2"],
    "timeLimit": 300,
    "passingScore": 70,
    "validUntil": "2025-12-31T23:59:59.000Z",
    "isActive": true,
    "statistics": {
        "totalAttempts": 10,
        "averageScore": 75.5,
        "completionRate": 90,
        "averageTimeSpent": 300
    }
}
```

### `GET /api/quizzes/:id/statistics` Lấy thống kê quiz **[Public]**

**Response:**

```json
{
    "totalAttempts": 100,
    "averageScore": 75.5,
    "completionRate": 90,
    "averageTimeSpent": 280,
    "topScorers": [
        {
            "username": "user1",
            "score": 95,
            "timeSpent": 250
        },
        {
            "username": "user2",
            "score": 90,
            "timeSpent": 270
        }
    ]
}
```

### `POST /api/quizzes/:id/start` Bắt đầu làm quiz **[Auth]**

**Response:**

```json
{
    "message": "Quiz started",
    "quiz": {
        "_id": "...",
        "name": "Quiz Ẩm thực Việt Nam",
        "description": "Kiểm tra kiến thức về các món ăn Việt.",
        "questions": [
            {
                "_id": "...",
                "content": "Phở bò là đặc sản của vùng nào?",
                "correctAnswer": ["Miền Bắc"],
                "incorrectAnswer": ["Miền Nam", "Miền Trung"],
                "relatedFood": "foodObjectId"
            }
        ],
        "timeLimit": 300,
        "passingScore": 70
    },
    "quizResult": {
        "_id": "...",
        "userId": "...",
        "quizId": "...",
        "startedAt": "2024-04-24T10:00:00.000Z",
        "totalQuestions": 10,
        "status": "in_progress"
    }
}
```

### `POST /api/quizzes/:id/submit` Nộp bài quiz **[Auth]**

**Request:**

```json
{
    "answers": [
        {
            "questionId": "string",
            "selectedAnswer": "string",
            "timeSpent": 30
        }
    ],
    "timeSpent": 300
}
```

**Response:**

```json
{
    "message": "Quiz submitted",
    "quizResult": {
        "_id": "...",
        "userId": "...",
        "quizId": "...",
        "score": 8,
        "correctAnswers": 8,
        "totalQuestions": 10,
        "timeSpent": 300,
        "startedAt": "2024-04-24T10:00:00.000Z",
        "completedAt": "2024-04-24T10:05:00.000Z",
        "status": "completed",
        "answers": [
            {
                "questionId": "...",
                "selectedAnswer": "string",
                "isCorrect": true,
                "timeSpent": 30
            }
        ],
        "rewards": {
            "badge": "badgeObjectId",
            "voucher": "voucherObjectId"
        }
    }
}
```

### `PUT /api/quizzes/:id` Cập nhật thông tin quiz **[Auth][Admin]**

**Request:**

```json
{
    "name": "Quiz Ẩm thực Việt Nam",
    "description": "Kiểm tra kiến thức về các món ăn Việt.",
    "imageUrl": "https://example.com/quiz.jpg",
    "questions": ["questionObjectId1", "questionObjectId2"],
    "timeLimit": 300,
    "passingScore": 70,
    "validUntil": "2025-12-31T23:59:59.000Z",
    "rewardBadge": "badgeObjectId",
    "rewardVoucher": "voucherObjectId"
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
        "timeLimit": 300,
        "passingScore": 70,
        "validUntil": "2025-12-31T23:59:59.000Z",
        "rewardBadge": "badgeObjectId",
        "rewardVoucher": "voucherObjectId",
        "isActive": true,
        "statistics": {
            "totalAttempts": 0,
            "averageScore": 0,
            "completionRate": 0,
            "averageTimeSpent": 0
        }
    }
}
```

### `DELETE /api/quizzes/:id` Xóa quiz **[Auth][Admin]**

**Response:**

```json
{
    "message": "Quiz deleted"
}
```

---

## Badge

### `POST /api/badges` Tạo badge mới **[Auth][Admin]**

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

### `GET /api/badges` Lấy danh sách tất cả badge **[Public]**

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

### `GET /api/badges/:id` Lấy thông tin chi tiết badge **[Public]**

**Response:**

```json
{
    "_id": "...",
    "name": "Chuyên gia ẩm thực",
    "iconUrl": "https://example.com/badge.png"
}
```

### `PUT /api/badges/:id` Cập nhật thông tin badge **[Auth][Admin]**

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

### `DELETE /api/badges/:id` Xóa badge **[Auth][Admin]**

**Response:**

```json
{
    "message": "Badge deleted"
}
```

---

## Voucher

### `POST /api/vouchers` Tạo voucher mới **[Auth][Admin]**

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

### `GET /api/vouchers` Lấy danh sách tất cả voucher **[Public]**

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

### `GET /api/vouchers/:id` Lấy thông tin chi tiết voucher **[Public]**

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

### `PUT /api/vouchers/:id` Cập nhật thông tin voucher **[Auth][Admin]**

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

### `DELETE /api/vouchers/:id` Xóa voucher **[Auth][Admin]**

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

## Quiz Result

### `GET /api/quiz-results/history` Lấy lịch sử quiz của user **[Auth]**

**Query Parameters:**

- `page`: Optional, integer, default is 1
- `limit`: Optional, integer, default is 10
- `status`: Optional, string, enum: ['completed', 'in_progress', 'abandoned']
- `startDate`: Optional, ISO date string
- `endDate`: Optional, ISO date string

**Response:**

```json
{
    "data": [
        {
            "_id": "...",
            "quizId": "...",
            "userId": "...",
            "score": 8,
            "correctAnswers": 8,
            "totalQuestions": 10,
            "timeSpent": 300,
            "startedAt": "2024-04-24T10:00:00.000Z",
            "completedAt": "2024-04-24T10:05:00.000Z",
            "status": "completed",
            "answers": [
                {
                    "questionId": "...",
                    "selectedAnswer": "string",
                    "isCorrect": true,
                    "timeSpent": 30
                }
            ],
            "rewards": {
                "badge": "badgeObjectId",
                "voucher": "voucherObjectId"
            }
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 20
    }
}
```

### `GET /api/quiz-results/statistics` Lấy thống kê quiz của user **[Auth]**

**Response:**

```json
{
    "totalQuizzes": 10,
    "averageScore": 75.5,
    "timeSpent": 3600,
    "completionRate": 90,
    "highScoreRate": 60,
    "timeEfficiency": 85,
    "rewardsEarned": 5
}
```

### `GET /api/quiz-results/result/:resultId` Lấy chi tiết kết quả quiz **[Auth]**

**Response:**

```json
{
    "_id": "...",
    "quizId": "...",
    "userId": "...",
    "score": 8,
    "correctAnswers": 8,
    "totalQuestions": 10,
    "timeSpent": 300,
    "startedAt": "2024-04-24T10:00:00.000Z",
    "completedAt": "2024-04-24T10:05:00.000Z",
    "status": "completed",
    "answers": [
        {
            "questionId": "...",
            "selectedAnswer": "string",
            "isCorrect": true,
            "timeSpent": 30
        }
    ],
    "rewards": {
        "badge": "badgeObjectId",
        "voucher": "voucherObjectId"
    }
}
```

### `GET /api/quiz-results/leaderboard/:quizId` Lấy bảng xếp hạng cho một quiz **[Auth]**

**Response:**

```json
{
    "data": [
        {
            "username": "user1",
            "score": 9,
            "timeSpent": 120,
            "completedAt": "2024-04-24T10:05:00.000Z"
        },
        {
            "username": "user2",
            "score": 8,
            "timeSpent": 150,
            "completedAt": "2024-04-24T09:30:00.000Z"
        },
        {
            "username": "user3",
            "score": 8,
            "timeSpent": 180,
            "completedAt": "2024-04-24T09:00:00.000Z"
        }
    ]
}
```
