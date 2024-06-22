
## Database Schema

### Users Table

사용자 정보를 저장하는 테이블입니다.

```markdown
### Table: users

| Column      | Type        | Constraints            | Description   |
|-------------|-------------|------------------------|---------------|
| id          | int         | PK, auto-increment     | 사용자 ID      |
| password    | varchar     |                        | 비밀번호       |
| last_login  | timestamp   |                        | 마지막 로그인  |
| is_superuser| int         |                        | 관리자 여부    |
| username    | int         |                        | 사용자 이름    |
| email       | int         |                        | 이메일         |
| is_staff    | int         |                        | 스태프 여부    |
| is_active   | int         |                        | 활성화 여부    |
| date_joined | timestamp   |                        | 가입 날짜      |
```

### Lectures Table

특강 정보를 저장하는 테이블입니다.

```markdown
### Table: lectures

| Column      | Type    | Constraints               | Description   |
|-------------|---------|---------------------------|---------------|
| id          | int     | PK, auto-increment        | 특강 ID        |
| title       | varchar |                           | 특강 제목      |
| description | text    |                           | 특강 설명      |
| date        | date    | NOT NULL                  | 특강 날짜      |
| time        | time    | NOT NULL                  | 특강 시간      |
| capacity    | int     | NOT NULL, default: 30     | 정원           |
```

### Applications Table

특강 신청 정보를 저장하는 테이블입니다.

```markdown
### Table: applications

| Column      | Type       | Constraints                | Description   |
|-------------|------------|----------------------------|---------------|
| id          | int        | PK, auto-increment         | 신청 ID        |
| user_id     | int        | NOT NULL, unique           | 사용자 ID      |
| lecture_id  | int        | NOT NULL, unique, FK       | 특강 ID        |
| timestamp   | datetime   | NOT NULL, default: CURRENT_TIMESTAMP | 신청 시간  |
```
### Foreign Keys

```markdown
### Foreign Keys

- `applications.lecture_id` references `lectures.id`
- `applications.user_id` references `users.id`
```

### ER Diagram

다음은 위 테이블과 외래 키 관계를 시각화한 ER 다이어그램입니다.

```plaintext
+-------------------+          +------------------------+          +--------------------+
|      users        |          |      applications      |          |      lectures      |
+-------------------+          +------------------------+          +--------------------+
| id (PK)           |          | id (PK)                |          | id (PK)            |
| password          | <------> | user_id (FK)           |          | title              |
| last_login        |          | lecture_id (FK)        | <------> | description        |
| is_superuser      |          | timestamp              |          | date               |
| username          |          +------------------------+          | time               |
| email             |                                              | capacity           |
| is_staff          |                                              +--------------------+
| is_active         |
| date_joined       |
+-------------------+
```


## User Table
```
Table users {
  id int [pk, increment] // auto-increment
  password varchar
  last_login timestamp
  is_superuser int
  username int
  email int
  is_staff int
  is_active int
  date_joined int
}
```

## Lectures Table
```
Table lectures {
id int [pk, increment]              // auto-increment
title varchar                       // 특강 제목
description text                    // 특강 설명
date date [not null]                // 특강 날짜
time time [not null]                // 특강 시간
capcity int [not null, default: 30] // 정원
}
```

## Applications Table
```
Table applications {
id int [pk, increment] // auto-increment
user_id int [not null, unique]        // 학생
lecture_id int [not null, unique]     //특강 (fk)
timestamp datetime  [NOT NULL, default: `CURRENT_TIMESTAMP`] // 신청시간
}
```
### FK
```
Ref: "lectures"."id" < "applications"."lecture_id"
Ref: "users"."id" < "applications"."user_id"
```
