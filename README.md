# snnnue.github.io

David Kang의 개인 웹사이트. React(Vite)로 만들었고, `main` 브랜치에 저장하면 1~2분 뒤 https://snnnue.github.io 에 자동으로 반영돼요.

## 혼자 수정하는 방법 (GitHub 웹사이트에서)

1. GitHub에서 바꾸고 싶은 파일을 열고 연필 아이콘(Edit)을 눌러요.
2. 수정한 뒤 **Commit changes**를 눌러요.
3. 상단 **Actions** 탭에서 초록 체크가 뜨면 사이트에 반영된 거예요. 빨간 X가 뜨면 보통 쉼표나 따옴표가 빠진 거라, 방금 고친 부분을 다시 확인하세요.

## 어떤 파일을 고치면 되나요

| 바꾸고 싶은 것 | 파일 |
| --- | --- |
| 소개글, 뉴스, 연구, 링크, 메뉴 이름 | `src/content.js` |
| 폰트, 글자 크기, 색상, 여백 | `src/theme.js` |
| 프로필 사진 | `src/assets/profile.jpg` (같은 이름으로 교체) |
| CV | `public/David_Kang_CV.pdf` (같은 이름으로 교체) |
| 학교/기관 로고 | `public/images/logos/` |
| 이미지 | `public/images/` 에 넣고 `content.js`에서 `"images/파일이름.png"` |

파일을 교체할 때는 GitHub에서 해당 폴더로 들어가 **Add file → Upload files**로 같은 이름의 파일을 올리면 돼요.

## 자주 하는 수정

- **뉴스 추가**: `content.js`의 `news` 맨 위에 한 줄 추가
  ```js
  { date: "Nov 2026", text: "새 소식 🎉" },
  ```
- **굵게 / 링크**: 문장 안에서 `**굵게**`, `[글자](https://주소)`
- **로고 달린 기관 링크**: `orgs`에 등록하고 문장에서 `{{키}}`로 사용
- **Projects 섹션 다시 켜기**: `content.js`의 `show.projects`를 `true`로

## 내 컴퓨터에서 미리 보기 (선택)

```bash
npm install
npm run dev
```

## 예전 사이트

예전 al-folio 버전은 `al-folio-backup` 브랜치에 그대로 남아 있어요.
