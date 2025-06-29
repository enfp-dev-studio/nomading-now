# Nomading Now - 서버리스 배포 가이드

## 수정된 내용

### 1. 서버리스 환경 최적화
- ✅ **Database Connection**: 서버리스에 최적화된 postgres 연결 설정
- ✅ **Connection Pooling**: 서버리스 환경에 맞는 connection pool 설정
- ✅ **Error Handling**: 강화된 에러 처리 및 연결 관리
- ✅ **Resource Management**: 자동 연결 정리 및 리소스 관리

### 2. Next.js 설정 수정
- ✅ **Static Export 제거**: API 라우트 사용을 위한 설정 변경
- ✅ **Webpack 최적화**: postgres 패키지 외부화
- ✅ **서버 컴포넌트 지원**: 서버리스 환경 최적화

### 3. Netlify 배포 설정
- ✅ **netlify.toml**: Netlify 최적화 설정
- ✅ **Next.js 플러그인**: @netlify/plugin-nextjs 추가
- ✅ **Functions 설정**: 서버리스 함수 최적화

## 배포 방법

### 1. Netlify에서 환경 변수 설정

Netlify 대시보드 → Site settings → Environment variables에서 다음 변수들을 설정하세요:

```bash
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NODE_ENV=production
```

### 2. 데이터베이스 연결 확인

배포 후 다음 URL로 헬스체크를 수행하세요:
```
https://your-site.netlify.app/api/health
```

### 3. 주요 변경 사항

#### Database Connection (`lib/db/index.ts`)
```typescript
// 서버리스 최적화 설정
const client = postgres(connectionString, {
  prepare: false,      // 서버리스에서 prepared statements 비활성화
  max: 1,             // 연결 수 제한
  idle_timeout: 20,   // 유휴 연결 타임아웃
  max_lifetime: 1800, // 연결 최대 생존시간
});
```

#### Service Layer (`lib/services/*.ts`)
```typescript
// withDatabase 래퍼 사용으로 안전한 연결 관리
export class TipsService {
  static async createTip(tipData: NewTip) {
    return withDatabase(async (db) => {
      // 데이터베이스 작업
    });
  }
}
```

#### API Routes (`app/api/*/route.ts`)
```typescript
// 표준 Next.js 13+ App Router API 패턴
export async function GET(request: NextRequest) {
  try {
    const result = await TipsService.getTips(options);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

## 문제 해결

### 1. 연결 오류가 발생하는 경우
- Supabase 데이터베이스 URL이 올바른지 확인
- 환경 변수가 Netlify에 올바르게 설정되었는지 확인
- `/api/health` 엔드포인트로 상태 확인

### 2. 빌드 오류가 발생하는 경우
```bash
npm install
npm run build
```

### 3. 서버리스 함수 타임아웃
- Netlify Pro 플랜에서는 함수 실행 시간이 26초로 제한됩니다
- 복잡한 쿼리는 최적화하거나 분할하세요

### 4. Cold Start 최적화
- 첫 번째 요청은 더 오래 걸릴 수 있습니다 (Cold Start)
- Connection pooling과 keep-alive 설정으로 최소화

## 성능 최적화 팁

1. **Database Queries**: 필요한 데이터만 선택하고 인덱스 활용
2. **API Response**: 적절한 캐시 헤더 설정
3. **Error Logging**: 프로덕션에서 적절한 로깅 구현
4. **Monitoring**: Netlify Analytics 및 Supabase 모니터링 활용

## 추가 리소스

- [Netlify Next.js 배포 가이드](https://docs.netlify.com/frameworks/next-js/)
- [Supabase 연결 가이드](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Drizzle ORM 문서](https://orm.drizzle.team/docs/overview)
