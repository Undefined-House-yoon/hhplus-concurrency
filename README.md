## 요구 사항을 만족시키기 위한 설계
### 1. 특강 신청 API (POST ```/lectures/apply```)
    특강 신청 시나리오:
       * 사용자 요청을 수신.
       * 해당 특강에 대한 신청자 수를 확인.
       * 신청자가 30명 미만이면 신청 기록을 추가.
       * 동일 사용자가 동일 특강에 여러 번 신청할 수 없도록 유니크 제약 조건 확인.
       * 트랜잭션과 잠금을 사용하여 동시성 이슈 해결.
### 2. 특강 신청 여부 조회 API (GET ```/lectures/application/{userId}```)
    신청 여부 조회 시나리오:
       * 사용자 요청을 수신.
       * 특정 사용자가 특정 특강에 대해 신청 여부를 조회.
       * 신청 여부를 반환.
### 3. 특강 목록 조회 API (GET ```/lectures```)
    특강 목록 조회 시나리오:
       * 사용자 요청을 수신.
       * 날짜별로 특강 목록을 조회.
       * 각 특강의 신청 가능 여부와 정원 정보를 포함하여 반환.


## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## License

Nest is [MIT licensed](LICENSE).
