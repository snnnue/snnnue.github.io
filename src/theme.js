// ─────────────────────────────────────────────────────────────
//  디자인 설정 파일: 폰트, 글자 크기, 색상
//  여기 값만 바꾸면 사이트 전체에 적용돼요.
// ─────────────────────────────────────────────────────────────

export const theme = {
  // ── 폰트 ───────────────────────────────────────────────
  // Google Fonts(fonts.google.com)에 있는 이름을 그대로 쓰면 자동으로 불러와요.
  // 예: "Inter", "Noto Sans KR", "IBM Plex Sans", "Manrope", "DM Sans"
  // weight(굵기)는 그 폰트가 지원하는 값이어야 해요 (Google Fonts 페이지에서 확인).
  fonts: {
    heading: { family: "Inter", weight: 600 }, // 이름, 큰 제목, 논문 제목
    body: { family: "Inter", weight: 400, boldWeight: 600 }, // 본문
    label: { family: "Inter", weight: 500 }, // ABOUT, PUBLICATIONS 같은 대문자 라벨
    korean: { family: "Noto Sans KR" }, // 한글이 나올 때 쓰는 폰트
  },

  // ── 글자 크기 (px) ─────────────────────────────────────
  sizes: {
    name: 26, // 왼쪽 위 이름
    hero: 27, // "Hi, I'm David." 큰 제목
    body: 15, // 본문
    nav: 12.5, // 왼쪽 메뉴
    tag: 11.5, // 태그 버튼
    sectionTitle: 15, // PUBLICATIONS, PROJECTS 제목
    itemLabel: 12, // ARXIV 2026 같은 작은 라벨
    itemTitle: 17, // 논문/연구 제목
    cardTitle: 15.5, // 프로젝트 카드 제목
    small: 14, // 저자, 링크, 설명
  },

  // ── 색상 ───────────────────────────────────────────────
  colors: {
    background: "#ffffff",
    text: "#1c1c1e", // 기본 글자
    body: "#3a3a3c", // 본문 글자
    muted: "#8a979c", // 회색(제목 두 번째 줄, 날짜, 공저자)
    line: "#e2e4e6", // 점선 구분선
    panel: "#f7f7f8", // 뉴스 박스, 이미지 배경
    accent: "#f29bbf", // 핑크 포인트
  },

  // ── 레이아웃 (px) ──────────────────────────────────────
  layout: {
    sidebarWidth: 250,
    gap: 64,
    maxWidth: 1440, // 사이트 전체 최대 너비
    sidePadding: 48, // 화면 양옆 여백
  },
};
