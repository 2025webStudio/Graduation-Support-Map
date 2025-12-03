---

# 📘 Seoul Graduation Support Map — Frontend 실행 및 빌드 안내

본 문서는 프로젝트를 처음 실행하거나 개발 및 빌드 과정에서
팀원들이 반드시 지켜야 하는 규칙과 주의사항을 정리한 문서입니다.

Next.js 16(App Router, Turbopack)의 특성상 **프로젝트 루트 인식이 민감**하므로,
아래 내용을 정확히 준수해야 합니다.

---

# 📂 1. 프로젝트 구조

```
seoulgraduation-support-map/
  frontend/             ← Next.js 프로젝트 루트
    app/
    public/
    package.json
    tsconfig.json
    node_modules/
    .next/
  backend/ (optional)
```

> ⚠️ **중요:** Next.js 프로젝트의 루트는 반드시 `frontend` 폴더입니다.

---

# 🚀 2. 최초 설치

```
cd frontend
yarn install
```

---

# 🧹 3. 빌드 시 `.next` 폴더 삭제 필수

Next.js(Turbopack)는 상위 폴더에 `.next`가 남아 있으면
프로젝트 루트를 잘못 인식하여 빌드 오류 또는 `_global-error`가 발생합니다.

### 🔥 반드시 삭제해야 하는 폴더

```
seoulgraduation-support-map/.next         ← 최상위 .next (지워야 함)
seoulgraduation-support-map/frontend/.next (빌드 후 자동 생성)
```

삭제 명령:

```
rm -rf ../.next
rm -rf .next
```

---

# 🧹 4. 상위 폴더의 node_modules 금지

Next.js는 package.json과 node_modules의 위치를 보고 루트를 판단하기 때문에
**frontend 바깥(상위 폴더)에 node_modules가 존재하면 오류가 발생합니다.**

삭제 명령:

```
rm -rf ../node_modules
```

---

# ▶️ 5. 개발 서버 실행

반드시 `frontend` 폴더에서 실행해야 합니다.

```
cd frontend
yarn dev
```

---

# 🏗 6. 빌드

```
cd frontend
yarn build
```

---

# 📌 7. App Router 폴더 / 파일명 규칙 (중요)

Next.js App Router는 파일명 규칙이 엄격합니다.
다음 구조를 반드시 지켜야 합니다:

```
app/
  page.tsx               ← 루트 페이지
  layout.tsx             ← 전체 레이아웃
  school/
    page.tsx             ← /school (목록 페이지)
    [id]/
      page.tsx           ← /school/{id} (상세 페이지)
  login/page.tsx
  signup/page.tsx
  calendar/page.tsx
```

### ❗ 아래와 같은 파일명은 전부 오류를 발생시킵니다.

* `pages.tsx`
* `Page.tsx`
* `page.jsx`
* `page.ts`
* `page.tsx.txt`
* `[id].tsx` (page.tsx 없이 단독 파일)

### ❗ `[id]` 폴더명도 반드시 **정확히** 이 문자열이어야 합니다.

유니코드 비슷한 문자(예: `［id］`)가 들어가면 Next.js는 폴더를 인식하지 못합니다.

—
