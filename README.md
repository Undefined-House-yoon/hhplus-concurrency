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

application/
├── controller/
│   ├── application.controller.spec.ts
│   └── application.controller.ts
├── domain/
│   ├── dto/
│   │   ├── create-application.dto.ts
│   │   └── update-application.dto.ts
│   ├── entities/
│   │   └── application.entity.ts
│   ├── repositories/
│   │   ├── application.repository.ts
│   │   └── application.repository.impl.ts
│   └── services/
│       └── application.service.ts
├── infrastructure/
│   └── services/
│       └── application.service.impl.ts
├── application.module.ts
└── test/
└── application.service.spec.ts

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



application/ports/inbound/: 입력 포트를 정의합니다. 주로 애플리케이션 서비스 인터페이스를 포함합니다.
application/ports/outbound/: 출력 포트를 정의합니다. 주로 리포지토리 인터페이스를 포함합니다.
domain/entities/: 도메인 엔티티를 정의합니다.
infrastructure/adapters/in/: 입력 어댑터를 정의합니다. 주로 웹 컨트롤러를 포함합니다.
infrastructure/adapters/out/: 출력 어댑터를 정의합니다. 주로 리포지토리 구현체를 포함합니다.
infrastructure/orm/: ORM 설정 파일을 포함합니다.
