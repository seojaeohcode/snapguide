# SnapGuide

사진 레퍼런스에서 촬영값을 역산하는 정적 대시보드 목업입니다.

## Local preview

```bash
python -m http.server 4173
```

브라우저에서 `http://localhost:4173`을 엽니다. 검색·정렬·필터·업로드·촬영값 적용 버튼은 정적 목업용 상호작용으로 동작합니다.

## GitHub Pages

`main` 브랜치에 push하면 `.github/workflows/pages.yml`이 GitHub Pages artifact를 생성하고 배포합니다. 저장소 설정에서 Pages의 Source가 `GitHub Actions`로 지정되어 있어야 합니다.
