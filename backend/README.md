# Human.Ai.D Backend API

Human.Ai.D 회사 홈페이지를 위한 Spring Boot 백엔드 API 서버입니다.

## 🚀 주요 기능

### 1. 문의사항 관리 (Contact Management)
- 고객 문의사항 접수 및 저장
- 이메일 알림 자동 발송
- 관리자용 문의사항 조회 및 관리
- 문의 유형별 분류 및 통계

### 2. 뉴스 관리 (News Management)
- 회사 뉴스 및 보도자료 관리
- 발행/미발행 상태 관리
- 카테고리별 뉴스 분류
- 검색 및 필터링 기능

### 3. 이메일 서비스
- 문의사항 접수 시 자동 이메일 발송
- 관리자 알림 이메일
- 고객 확인 이메일

## 🛠 기술 스택

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: H2 (개발), MySQL (프로덕션)
- **ORM**: Spring Data JPA
- **Security**: Spring Security
- **Email**: Spring Mail
- **Build Tool**: Maven

## 📁 프로젝트 구조

```
backend/
├── src/main/java/com/humanaid/
│   ├── HumanaidApplication.java          # 메인 애플리케이션 클래스
│   ├── config/                           # 설정 클래스들
│   │   ├── AsyncConfig.java             # 비동기 처리 설정
│   │   └── WebConfig.java               # CORS 설정
│   ├── controller/                       # REST 컨트롤러
│   │   ├── ContactController.java       # 문의사항 API
│   │   └── NewsController.java          # 뉴스 API
│   ├── dto/                             # 데이터 전송 객체
│   │   ├── ApiResponse.java             # 공통 응답 형식
│   │   └── ContactRequest.java          # 문의사항 요청 DTO
│   ├── entity/                          # JPA 엔티티
│   │   ├── Contact.java                 # 문의사항 엔티티
│   │   └── News.java                    # 뉴스 엔티티
│   ├── exception/                       # 예외 처리
│   │   └── GlobalExceptionHandler.java  # 전역 예외 처리기
│   ├── repository/                      # 데이터 접근 계층
│   │   ├── ContactRepository.java       # 문의사항 리포지토리
│   │   └── NewsRepository.java          # 뉴스 리포지토리
│   └── service/                         # 비즈니스 로직
│       ├── ContactService.java          # 문의사항 서비스
│       ├── EmailService.java            # 이메일 서비스
│       └── NewsService.java             # 뉴스 서비스
├── src/main/resources/
│   ├── application.yml                  # 애플리케이션 설정
│   └── data.sql                         # 초기 데이터
└── pom.xml                              # Maven 설정
```

## 🔧 설치 및 실행

### 1. 사전 요구사항
- Java 17 이상
- Maven 3.6 이상

### 2. 프로젝트 클론 및 빌드
```bash
cd backend
mvn clean install
```

### 3. 애플리케이션 실행
```bash
mvn spring-boot:run
```

### 4. 개발 환경 설정
개발 환경에서는 H2 인메모리 데이터베이스를 사용합니다.
- H2 콘솔: http://localhost:8080/api/h2-console
- JDBC URL: jdbc:h2:mem:testdb
- Username: sa
- Password: (비어있음)

## 📡 API 엔드포인트

### 문의사항 API (Contact API)

#### 공개 API
- `POST /api/contacts` - 문의사항 등록

#### 관리자 API
- `GET /api/contacts` - 모든 문의사항 조회 (페이징)
- `GET /api/contacts/unprocessed` - 처리되지 않은 문의사항 조회
- `GET /api/contacts/{id}` - 문의사항 상세 조회
- `PUT /api/contacts/{id}/process` - 문의사항 처리 완료 표시
- `GET /api/contacts/by-type/{inquiryType}` - 문의 유형별 조회
- `GET /api/contacts/search?keyword={keyword}` - 키워드 검색
- `GET /api/contacts/stats/by-type` - 문의 유형별 통계
- `GET /api/contacts/stats/by-month` - 월별 문의 통계
- `DELETE /api/contacts/{id}` - 문의사항 삭제

### 뉴스 API (News API)

#### 공개 API
- `GET /api/news/published` - 발행된 뉴스 목록 조회 (페이징)
- `GET /api/news/latest?limit={limit}` - 최신 뉴스 조회 (메인페이지용)
- `GET /api/news/category/{category}` - 카테고리별 뉴스 조회
- `GET /api/news/{id}` - 뉴스 상세 조회
- `GET /api/news/search?keyword={keyword}` - 뉴스 검색

#### 관리자 API
- `POST /api/news` - 뉴스 등록
- `GET /api/news/admin/all` - 모든 뉴스 조회 (발행 여부 무관)
- `PUT /api/news/{id}` - 뉴스 수정
- `PUT /api/news/{id}/toggle-publish` - 뉴스 발행/발행취소
- `DELETE /api/news/{id}` - 뉴스 삭제
- `GET /api/news/admin/stats/by-category` - 카테고리별 통계
- `GET /api/news/admin/stats/by-month` - 월별 발행 뉴스 통계

## 📧 이메일 설정

이메일 기능을 사용하려면 `application.yml`에서 다음 설정을 수정하세요:

```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: your-email@gmail.com
    password: your-app-password
```

또는 환경 변수로 설정:
```bash
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
```

## 🗄 데이터베이스 설정

### 개발 환경 (H2)
기본적으로 H2 인메모리 데이터베이스를 사용합니다.

### 프로덕션 환경 (MySQL)
프로덕션 환경에서는 MySQL을 사용합니다:

```yaml
spring:
  profiles:
    active: prod
  datasource:
    url: jdbc:mysql://localhost:3306/humanaid_db
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
```

## 🔒 보안 설정

현재는 기본적인 CORS 설정만 적용되어 있습니다. 프로덕션 환경에서는 다음을 추가로 고려하세요:

- JWT 기반 인증/인가
- API Rate Limiting
- HTTPS 설정
- 입력값 검증 강화

## 📊 모니터링

Spring Boot Actuator를 통한 헬스체크 및 메트릭 수집이 가능합니다:
- Health Check: `/api/actuator/health`
- Metrics: `/api/actuator/metrics`

## 🧪 테스트

```bash
mvn test
```

## 📝 로그

로그 레벨은 `application.yml`에서 설정할 수 있습니다:
```yaml
logging:
  level:
    com.humanaid: DEBUG
```

## 🚀 배포

### Docker를 사용한 배포
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/humanaid-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### 빌드 및 실행
```bash
mvn clean package
docker build -t humanaid-backend .
docker run -p 8080:8080 humanaid-backend
```

## 📞 문의사항

기술적 문의사항이 있으시면 다음으로 연락해 주세요:
- 이메일: contact@humanaid.digital
- 전화: 02-1234-5678