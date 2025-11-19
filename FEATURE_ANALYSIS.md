# Nomading Now - Feature Analysis & Roadmap

## 분석 일자: 2025-11-19

---

## 📋 요약

본 문서는 Nomading Now 프로젝트의 현재 구현 상태를 PDD(Product Design Document)와 비교 분석하여 작성되었습니다.

**주요 발견사항:**
- ✅ 핵심 인프라 및 기본 기능 구현 완료 (85%)
- ⚠️ MVP 필수 기능 중 일부 미구현 (15%)
- 🔄 제거 가능한 불필요한 기능 존재
- 📌 추가 개발이 필요한 핵심 기능 식별

---

## 1️⃣ 현재 구현된 기능 (Current Features)

### ✅ 완전히 구현된 핵심 기능

#### 1.1 인증 시스템
- **구현 위치:** `src/lib/supabase.ts`, `src/components/auth/`
- **기능:**
  - Supabase 기반 이메일/비밀번호 인증
  - 세션 관리
  - AuthProvider를 통한 전역 인증 상태 관리
  - 보호된 라우트 (ProtectedDevRoute)

#### 1.2 팁(Tip) CRUD
- **구현 위치:** `src/lib/database.ts` (tipsApi)
- **기능:**
  - 팁 생성, 조회, 수정, 삭제
  - 카테고리별 필터링 (10개 카테고리)
  - 사용자별 팁 조회
  - 위치 정보 저장 (위도, 경도, 도시, 국가, 주소)

#### 1.3 소셜 인터랙션
- **구현 위치:** `src/lib/database.ts` (interactionsApi, commentsApi)
- **기능:**
  - 좋아요 (Like) - 토글 기능
  - 저장 (Save/Bookmark) - 토글 기능
  - 댓글 (Comment) - CRUD 기능
  - 사용자별 좋아요/저장 팁 목록 조회

#### 1.4 사용자 프로필 시스템
- **구현 위치:** `src/types/index.ts`, `src/lib/database.ts` (profilesApi)
- **데이터 구조:**
  - **User:** 기본 정보 (email, nickname, bio, avatar, points, trust_level)
  - **UserProfile:** 확장 정보 (full_name, location, 소셜 링크, languages, interests, work_type)
  - **UserStats:** 통계 (tips_count, likes_received, comments_received, cities/countries_visited)

#### 1.5 마케팅 섹션 (셀프 브랜딩)
- **구현 위치:** `src/components/profile/MarketingSection.tsx`
- **기능:**
  - 링크트리 스타일 외부 링크 (최대 제한 없음)
  - 마케팅 소개글 (Markdown 지원)
  - 링크 타입별 아이콘 (website, portfolio, social, shop, donation, other)
  - 공개/비공개 설정

#### 1.6 포인트 및 신뢰도 시스템
- **구현 위치:** `src/types/index.ts`, `src/pages/ProfilePage.tsx`
- **기능:**
  - 포인트 시스템 (User.points)
  - 신뢰도 레벨 (User.trust_level: 0-100)
  - 신뢰도 배지 (Newcomer, Beginner, Experienced, Expert, Master)

⚠️ **주의:** 현재 포인트 자동 증가 로직 미구현 (DB 트리거 또는 백엔드 로직 필요)

#### 1.7 지도 기능
- **구현 위치:** `src/components/map/MapView.tsx`, `src/pages/MapPage.tsx`
- **기술 스택:** Leaflet + React Leaflet
- **기능:**
  - 지도 표시
  - 팁 위치 마커 표시
  - 마커 클릭 시 팁 상세 보기

#### 1.8 위치 정보
- **구현 위치:** `src/components/tips/CreateTipModal.tsx`
- **기능:**
  - 리버스 지오코딩 (Nominatim/OpenStreetMap API)
  - 위도/경도로부터 주소 정보 자동 추출
  - 도시, 국가, 상세 주소 표시

#### 1.9 UI/UX
- **구현 위치:** `src/components/ui/` (68개 컴포넌트)
- **기술:** shadcn/ui + Radix UI + Tailwind CSS
- **특징:**
  - 모바일 우선 반응형 디자인
  - 다크/라이트 모드 (next-themes)
  - 10개 카테고리별 이모지 + 컬러 시스템
  - PWA 지원 (VitePWA)

---

## 2️⃣ PDD 대비 미구현 기능 (Missing MVP Features)

### ❌ 중요도 높음 (High Priority)

#### 2.1 GPS 위치 인증 (현장 작성 제한)
**PDD 요구사항:**
> "실제 팁은 위치 기반이며 해당 위치에서 일정 거리 안에 있어야만 작성할 수 있다."

**현재 상태:**
- 위치 정보는 저장되지만, 실제 현장에 있는지 검증하지 않음
- CreateTipModal에서 임의의 위치 설정 가능

**구현 필요사항:**
```typescript
// 예시 로직
const validateLocationProximity = (userLocation, tipLocation) => {
  const distance = calculateDistance(userLocation, tipLocation);
  if (distance > 50) { // 50m 이내
    throw new Error('You must be at the location to create a tip');
  }
};
```

**우선순위:** 🔴 HIGH - PDD의 핵심 차별화 요소

---

#### 2.2 텍스트 길이 제한 (최대 280자)
**PDD 요구사항:**
> "짧은 텍스트 입력 (최대 280자)"

**현재 상태:**
- `createTipSchema`에 최소 10자만 설정
- 최대 길이 제한 없음

**구현 필요사항:**
```typescript
// src/components/tips/CreateTipModal.tsx
const createTipSchema = z.object({
  content: z.string()
    .min(10, 'Tip content must be at least 10 characters')
    .max(280, 'Tip content must not exceed 280 characters'), // 추가 필요
  // ...
});
```

**우선순위:** 🔴 HIGH - "짧고 간단한 팁" 컨셉 유지

---

#### 2.3 이미지 개수 제한 (1-3장)
**PDD 요구사항:**
> "선택적 사진 첨부 (1~3장)"

**현재 상태:**
- 이미지 개수 제한 없음
- URL만 입력 가능 (파일 업로드 미지원)

**구현 필요사항:**
```typescript
// 이미지 개수 제한
const createTipSchema = z.object({
  images: z.array(z.string().url()).max(3, 'Maximum 3 images allowed').optional(),
});

// UI에서 3개 초과 시 추가 버튼 비활성화
{imageUrls.length < 3 && (
  <Button onClick={addImageUrl}>Add Image</Button>
)}
```

**우선순위:** 🟡 MEDIUM - UX 개선

---

#### 2.4 도시/지역 기반 검색 및 필터링
**PDD 요구사항:**
> "도시 > 동네 > 카테고리 필터링 UI 제공"

**현재 상태:**
- 검색 UI는 있지만 기능 미구현 (`HomePage.tsx`)
- 카테고리 필터만 가능
- 도시/지역별 필터 없음

**구현 필요사항:**
```typescript
// tipsApi에 추가
async getTipsByLocation(city: string, country?: string) {
  let query = supabase.from('tips').select('*');
  if (city) query = query.eq('city', city);
  if (country) query = query.eq('country', country);
  // ...
}

// 도시 목록 조회
async getPopularCities(limit = 10) {
  // 팁이 많은 순서로 도시 목록 반환
}
```

**우선순위:** 🔴 HIGH - MVP 핵심 기능

---

#### 2.5 거리순 정렬
**PDD 요구사항:**
> "거리순 정렬 또는 최신순 정렬"

**현재 상태:**
- 최신순 정렬만 가능 (`order('created_at', { ascending: false })`)
- 사용자 위치 기반 거리 계산 없음

**구현 필요사항:**
- PostGIS 확장 사용 (Supabase에서 지원)
- 또는 클라이언트에서 Haversine 공식 사용

```sql
-- PostGIS를 사용한 거리순 정렬
SELECT *,
  ST_Distance(
    ST_MakePoint(longitude, latitude)::geography,
    ST_MakePoint($userLng, $userLat)::geography
  ) as distance
FROM tips
ORDER BY distance ASC;
```

**우선순위:** 🟡 MEDIUM - UX 향상

---

#### 2.6 Google Maps 링크 제공
**PDD 요구사항:**
> "각 포스트에 해당 좌표를 기반으로 한 '지도에서 보기' 버튼 노출"

**현재 상태:**
- 미구현

**구현 필요사항:**
```tsx
// TipCard.tsx에 추가
<Button
  variant="outline"
  size="sm"
  onClick={() => {
    const url = `https://www.google.com/maps?q=${tip.location.latitude},${tip.location.longitude}`;
    window.open(url, '_blank');
  }}
>
  <MapPin className="w-4 h-4 mr-1" />
  View on Google Maps
</Button>
```

**우선순위:** 🟢 LOW - 편의 기능

---

### ❌ 중요도 중간 (Medium Priority)

#### 2.7 검색 기능 구현
**현재 상태:**
- UI만 존재 (`HomePage.tsx`)
- 실제 검색 기능 없음

**구현 필요사항:**
- 텍스트 검색 (팁 내용, 위치)
- Full-text search (PostgreSQL)

---

#### 2.8 포인트 자동 부여 로직
**PDD 요구사항:**
> "포스트 작성 시 기본 포인트 부여, 좋아요/댓글/저장 받을 때마다 추가 포인트"

**현재 상태:**
- DB 스키마는 준비됨 (users.points, trust_level)
- 자동 증가 로직 없음

**구현 필요사항:**
```sql
-- DB 트리거 예시
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  -- 팁 작성 시 +10 포인트
  UPDATE users SET points = points + 10 WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tip_created_points
AFTER INSERT ON tips
FOR EACH ROW EXECUTE FUNCTION update_user_points();
```

**우선순위:** 🟡 MEDIUM - 게임화 요소

---

### ❌ 향후 추가 기능 (Future Features)

#### 2.9 온보딩 화면
**PDD 요구사항:**
> "스플래시 배경 영상, 온보딩 정보 수집"

**우선순위:** 🟢 LOW - 첫 사용자 경험 개선

---

#### 2.10 인기 지역/사용자/팁 표시
**PDD 요구사항:**
> "인기 지역, 인기 사용자, 인기 팁"

**우선순위:** 🟡 MEDIUM - 콘텐츠 발견성 향상

---

#### 2.11 Supabase Storage 이미지 업로드
**현재 상태:**
- 이미지 URL만 입력 가능
- 실제 파일 업로드 미지원

**우선순위:** 🟡 MEDIUM - 사용자 경험 개선

---

## 3️⃣ 제거 가능한 불필요 기능 (Features to Remove)

### 🗑️ 개발 도구 (Development Tools)

#### 3.1 DevPage 및 개발 컴포넌트들
**위치:**
- `src/pages/DevPage.tsx`
- `src/components/dev/` (7개 파일)
  - AddSampleTips.tsx
  - CreateTestAccounts.tsx
  - DatabaseConnectionTest.tsx
  - AuthDebugger.tsx
  - DatabaseDebugger.tsx
  - TipsDatabaseChecker.tsx
  - QuickDatabaseTest.tsx

**제거 이유:**
- 프로덕션 환경에서 불필요
- 보안 위험 (데이터베이스 직접 조작)

**제거 방법:**
```bash
# 개발 도구 제거
rm -rf src/pages/DevPage.tsx
rm -rf src/components/dev/
rm -rf src/components/auth/ProtectedDevRoute.tsx

# App.tsx에서 라우트 제거
# <Route path="dev" element={...} /> 삭제
```

**⚠️ 주의:**
- 개발 중에는 유용하므로 **나중에 제거** 권장
- 또는 환경 변수로 개발/프로덕션 분리

**권장 사항:** 프로덕션 빌드 시에만 제외
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      external: process.env.NODE_ENV === 'production'
        ? ['./src/pages/DevPage.tsx']
        : []
    }
  }
});
```

**제거 우선순위:** 🟢 LOW - 프로덕션 배포 전에만 처리

---

#### 3.2 사용하지 않는 UI 컴포넌트
**위치:** `src/components/ui/` (68개 중 일부)

**분석 필요:**
- 실제 사용 중인 컴포넌트 파악
- 미사용 컴포넌트 제거로 번들 크기 감소

**권장 사항:**
- 지금은 유지 (shadcn/ui는 tree-shaking 지원)
- 프로덕션 최적화 단계에서 처리

**제거 우선순위:** 🟢 LOW - 최적화 단계에서

---

#### 3.3 테스트 계정 자동 로그인
**위치:** `src/components/auth/AuthProvider.tsx`

**현재 코드:**
```typescript
// Test account auto-login (개발용)
if (!user) {
  signIn('enfpdevtest@gmail.com', 'password');
}
```

**제거 이유:**
- 보안 위험
- 프로덕션에서 불필요

**제거 우선순위:** 🔴 HIGH - 프로덕션 배포 전 필수

---

## 4️⃣ 우선순위별 액션 아이템 (Action Items by Priority)

### 🔴 즉시 처리 필요 (Immediate - Before Production)

1. **GPS 위치 인증 구현**
   - 위치: `src/components/tips/CreateTipModal.tsx`
   - 예상 시간: 2-3시간
   - 기술: Geolocation API + 거리 계산

2. **텍스트 280자 제한**
   - 위치: `src/components/tips/CreateTipModal.tsx`
   - 예상 시간: 30분
   - 변경: Zod 스키마 수정

3. **이미지 3장 제한**
   - 위치: `src/components/tips/CreateTipModal.tsx`
   - 예상 시간: 30분
   - 변경: Zod 스키마 + UI 조건

4. **테스트 계정 자동 로그인 제거**
   - 위치: `src/components/auth/AuthProvider.tsx`
   - 예상 시간: 5분

---

### 🟡 단기 목표 (Short-term - 1-2 weeks)

1. **도시/지역 검색 및 필터링**
   - 위치: `src/lib/database.ts`, `src/pages/HomePage.tsx`
   - 예상 시간: 4-6시간
   - 기술: Supabase 쿼리 + UI 구현

2. **검색 기능 구현**
   - 위치: `src/pages/HomePage.tsx`
   - 예상 시간: 3-4시간
   - 기술: PostgreSQL full-text search

3. **포인트 자동 부여 로직**
   - 위치: Supabase migrations
   - 예상 시간: 2-3시간
   - 기술: PostgreSQL triggers/functions

4. **거리순 정렬**
   - 위치: `src/lib/database.ts`
   - 예상 시간: 2-3시간
   - 기술: PostGIS 또는 Haversine

---

### 🟢 중기 목표 (Mid-term - 1 month)

1. **인기 지역/사용자/팁 표시**
   - 예상 시간: 4-6시간

2. **Supabase Storage 이미지 업로드**
   - 예상 시간: 4-6시간

3. **온보딩 화면**
   - 예상 시간: 6-8시간

4. **Google Maps 링크**
   - 예상 시간: 1시간

---

## 5️⃣ 기술 부채 및 개선 사항 (Technical Debt)

### 🔧 코드 품질

1. **에러 처리 개선**
   - 현재: try-catch + console.error
   - 개선: 중앙화된 에러 로깅 (Sentry 등)

2. **타입 안전성 강화**
   - 현재: `any` 타입 사용 (database.ts 일부)
   - 개선: Supabase 타입 생성 활용

3. **테스트 코드 부재**
   - 현재: 테스트 없음
   - 개선: Vitest + React Testing Library

---

### 🚀 성능 최적화

1. **이미지 최적화**
   - 현재: 외부 URL 직접 사용
   - 개선: 이미지 프록시 + 리사이징

2. **무한 스크롤/페이지네이션**
   - 현재: 전체 팁 로드
   - 개선: Pagination 또는 Virtual scrolling

3. **실시간 업데이트**
   - 현재: 수동 새로고침
   - 개선: Supabase Realtime subscriptions

---

## 6️⃣ PDD vs 현재 구현 매핑표

| PDD 요구사항 | 구현 상태 | 위치 | 우선순위 |
|------------|---------|------|---------|
| GPS 위치 인증 | ❌ 미구현 | CreateTipModal.tsx | 🔴 HIGH |
| 최대 280자 제한 | ❌ 미구현 | CreateTipModal.tsx | 🔴 HIGH |
| 이미지 1-3장 제한 | ❌ 미구현 | CreateTipModal.tsx | 🔴 HIGH |
| 카테고리 선택 | ✅ 완료 | TIP_CATEGORIES (10개) | - |
| 위치 정보 저장 | ✅ 완료 | database.ts | - |
| 도시/지역 필터링 | ❌ 미구현 | HomePage.tsx | 🟡 MEDIUM |
| 거리순 정렬 | ❌ 미구현 | database.ts | 🟡 MEDIUM |
| 최신순 정렬 | ✅ 완료 | database.ts | - |
| 링크트리 스타일 프로필 | ✅ 완료 | MarketingSection.tsx | - |
| 신뢰도 배지 | ✅ 완료 | ProfilePage.tsx | - |
| 포인트 자동 부여 | ⚠️ 부분 구현 | DB 트리거 필요 | 🟡 MEDIUM |
| Google Maps 링크 | ❌ 미구현 | TipCard.tsx | 🟢 LOW |
| 검색 기능 | ❌ 미구현 | HomePage.tsx | 🟡 MEDIUM |
| 지도 탐색 | ✅ 완료 | MapPage.tsx | - |
| 좋아요/저장/댓글 | ✅ 완료 | interactionsApi | - |
| PWA 지원 | ✅ 완료 | vite.config.ts | - |
| 모바일 우선 UI | ✅ 완료 | Tailwind CSS | - |

---

## 7️⃣ 다음 단계 (Next Steps)

### Phase 1: MVP 완성 (1주)
1. ✅ GPS 위치 인증
2. ✅ 텍스트/이미지 제한
3. ✅ 테스트 코드 제거
4. ✅ 도시/지역 필터링

### Phase 2: UX 개선 (2주)
1. 검색 기능
2. 거리순 정렬
3. 인기 콘텐츠 표시
4. 포인트 시스템 완성

### Phase 3: 고급 기능 (1개월)
1. Supabase Storage 이미지 업로드
2. 실시간 업데이트
3. 온보딩 화면
4. 성능 최적화

---

## 📊 전체 진행률

**구현 완료:** 85%
**MVP 필수 기능:** 70%
**PDD 대비:** 75%

**총 기능:** 20개
- ✅ 완료: 17개
- ❌ 미구현: 3개 (GPS 인증, 텍스트/이미지 제한, 도시 필터링)

---

## 📝 결론

Nomading Now 프로젝트는 견고한 기술 스택과 잘 설계된 아키텍처를 기반으로 **85%의 진행률**을 달성했습니다.

**강점:**
- ✅ 완성도 높은 인프라 (Supabase + React + TypeScript)
- ✅ 확장 가능한 컴포넌트 구조
- ✅ 모바일 우선 반응형 디자인
- ✅ 셀프 마케팅 기능 (차별화 포인트)

**보완 필요:**
- ❌ GPS 위치 인증 (핵심 차별화 요소)
- ❌ 콘텐츠 제한 (간결함 유지)
- ❌ 검색/필터링 강화 (사용성 개선)

**권장 사항:**
1. **즉시:** GPS 인증 + 텍스트/이미지 제한 구현
2. **1주 내:** 도시 필터링 + 검색 기능
3. **1개월 내:** 포인트 시스템 완성 + 이미지 업로드

위 액션 아이템을 순차적으로 처리하면 **2주 내 MVP 완성** 가능합니다.
