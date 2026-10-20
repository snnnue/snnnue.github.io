// ─────────────────────────────────────────────────────────────
//  사이트 내용은 전부 이 파일에 있어요.
//  - 글자만 바꾸면 사이트에 그대로 반영돼요.
//  - 항목 추가: { ... } 블록 하나를 복사해서 붙여넣고 내용만 바꾸세요.
//  - 블록 사이 쉼표(,)를 꼭 남겨두세요.
//  - 문장 안에서 **굵게**, [링크 글자](https://주소) 를 쓸 수 있어요.
//  - 이미지는 public/images 폴더에 넣고 "images/파일이름.png" 처럼 적으세요.
//    비워두면 픽셀 무늬 자리표시가 나와요.
//  - 사진 교체: src/assets/profile.jpg 를 같은 이름으로 바꿔 넣으세요.
//  - CV 교체: public/David_Kang_CV.pdf 를 같은 이름으로 바꿔 넣으세요.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "David Kang",
  greeting: "Hi, I'm David.", // 큰 제목 검정 부분
  // 회색 부분. \n 이 있는 곳에서 줄이 바뀌어요 (넓은 화면에서만)
  tagline: "A neuroscience student studying\nhow the brain decides where a memory lives.",


  // {{uoft}} 처럼 쓰면 아래 orgs의 로고 + 굵은 밑줄 링크로 나와요.
  bio: [
    "I am a fourth-year Life Sciences student at the {{uoft}}, double majoring in **Physiology** and **Health & Disease**, and a research student in the {{jflab}} at {{sickkids}}, advised by **Prof. Sheena Josselyn**. Before that, I trained in engram research at the {{mbl}} at {{kaist}} with **Prof. Jin Hee Han**.",
    "My research focuses on **memory engrams** and **fear memory circuits**. I am currently characterizing the **temporal dynamics of Npas4 expression in the lateral amygdala**. Building on this, I am interested in applying **computational and AI methods** to neuroscience and clinical research.",
  ],
  tags: ["Memory engrams", "Fear memory", "AI for neuroscience"],
  outside: "Outside the lab, I run {{arc}}, a student-led academic journal club at UofT.",

  links: {
    linkedin: "https://www.linkedin.com/in/davidsankang",
    instagram: "https://www.instagram.com/snnnye/",
    github: "", // 넣으면 GitHub 아이콘이 생겨요
    scholar: "", // Google Scholar 주소
    email: "ds.kang@mail.utoronto.ca",
    cvPdf: "David_Kang_CV.pdf", // 메뉴의 CV를 누르면 이 파일이 새 탭으로 열려요
  },
};

// 소개글에 들어가는 학교/기관. {{키}}로 불러와요.
// logo: public/images/logos 폴더에 파일을 넣으면 이름 앞에 작게 나와요. 파일이 없으면 글자만 보여요.
// logoHeight: 로고 높이 (글자 크기 기준 배수, 기본 1.1)
export const orgs = {
  uoft: { name: "University of Toronto", url: "https://www.utoronto.ca", logo: "images/logos/uoft.png", logoHeight: 1.45 },
  sickkids: { name: "SickKids", url: "https://www.sickkids.ca", logo: "images/logos/sickkids.png", logoHeight: 0.8 },
  kaist: { name: "KAIST", url: "https://bio.kaist.ac.kr", logo: "images/logos/kaist.png", logoHeight: 0.8 },
  jflab: { name: "Josselyn–Frankland Lab", url: "https://www.jflab.ca/", logo: "" },
  arc: { name: "ARC", url: "https://sop.utoronto.ca/group/association-for-research-in-clinical-science-arc/", logo: "images/logos/arc.png", logoHeight: 0.7 },
  morevision: { name: "MORE VISION", url: "https://morevision.kr", logo: "images/logos/morevision.png", logoHeight: 0.85 },
  mbl: { name: "Memory Biology Lab", url: "https://sites.google.com/view/kaistmbl", logo: "" },
};

// 섹션 켜기/끄기. true로 바꾸면 메뉴와 페이지가 다시 생겨요.
export const show = {
  projects: false,
};

// 메뉴 이름. 바꾸고 싶으면 글자만 수정하세요.
export const navLabels = {
  about: "About",
  research: "Research",
  interests: "Interests",
  projects: "Projects",
  cv: "CV",
};

// 최신 소식. 맨 위가 가장 최근. 첫 줄만 보이고, 누르면 전체가 펼쳐져요.
export const news = [
  { date: "Oct 2026", text: "Leading ARC's first neuroscience journal club series 🧠" },
  { date: "Sep 2026", text: "Started my PSL498Y research project in the Josselyn–Frankland Lab 🔬" },
  { date: "Sep 2026", text: "Held the first general meeting of ARC, the club I founded at UofT 🎉" },
  { date: "2026", text: "Received the Victoria Reunion Award from the University of Toronto 🏅" },
  { date: "Jan 2026", text: "Joined the Josselyn–Frankland Lab at SickKids as a research volunteer 🧪" },
  { date: "Jun 2025", text: "Selected for KAIST's Undergraduate Research Program and joined the Memory Biology Lab 🇰🇷" },
  { date: "Nov 2024", text: "Volunteered on research in the Dept. of Orthopaedics at Mount Sinai Hospital 🏥" },
  { date: "Sep 2023", text: "Started my B.S. at the University of Toronto 🍁" },
];

// 연구. group 별로 묶여서 보여요.
// label: 왼쪽 작은 글씨 (기간 등) / title: 제목 / meta: 회색 한 줄 / text: 설명
// links: label은 "Poster", "Slides", "Paper", "Webpage", "Code" 등. url이 비어 있으면 안 보여요.
export const research = [
  {
    group: "Projects & Presentations",
    items: [
      {
        label: "2026/27",
        title: "Characterizing the temporal dynamics of Npas4 expression in the lateral amygdala following fear memory encoding and retrieval",
        meta: "UofT PSL498Y1 Project in Physiology",
        links: [{ label: "Poster", url: "" }],
      },
    ],
  },
  {
    group: "Research Experience",
    items: [
      {
        label: "Jan 2026 – Present",
        title: "Josselyn–Frankland Lab, SickKids PGCRL",
        meta: "Research student (Sep 2026 –), Research volunteer (Jan – Aug 2026) · Advisor: Prof. Sheena Josselyn",
        text: "Researching the temporal dynamics of Npas4 expression in the lateral amygdala, with fluorescence cell counting in Fiji/ImageJ.",
      },
      {
        label: "Jun – Jul 2025",
        title: "Memory Biology Lab, KAIST",
        meta: "Research student · Advisor: Prof. Jin Hee Han",
        text: "Trained in stereotaxic viral surgery, perfusion, and brain slicing for engram research.",
      },
      {
        label: "Nov 2024",
        title: "Dept. of Orthopaedics, Mount Sinai Hospital",
        meta: "Research volunteer · Advisor: Dr. Oleg Safir",
        text: "Analyzed long-term post-operative outcomes for gluteus maximus patients using EMR.",
      },
    ],
  },
];

// 프로젝트 카드. tag 이름으로 위쪽 필터 버튼이 자동으로 만들어져요.
export const projects = [
  {
    title: "Npas4 Poster",
    tag: "Research",
    year: 2026,
    image: "",
    text: "Temporal dynamics of Npas4 expression in the lateral amygdala after fear memory encoding and retrieval. PSL498Y1 project.",
    url: "",
  },
  {
    title: "Independent Music Publication",
    tag: "Editorial",
    year: 2023,
    image: "",
    text: "Founding member, editor and designer. Grew an online music editorial platform to 60K+ followers and 1M+ organic views a month.",
    url: "",
  },
  {
    title: "ARC",
    tag: "Leadership",
    year: 2026,
    image: "",
    text: "Founded the Association for Research in Clinical Science, an academic club at UofT running journal clubs and seminars.",
    url: "",
  },
  {
    title: "Korean Language School",
    tag: "Teaching",
    year: 2023,
    image: "",
    text: "Volunteer Korean language teacher at a local community school since 2023.",
    url: "",
  },
];

// ─────────────────────────────────────────────────────────────
//  INTERESTS 페이지 (메뉴에서 클릭하면 따로 열리는 화면)
// ─────────────────────────────────────────────────────────────
export const interests = {
  // OUTSIDE THE LAB: 위에 음악 매거진 경력, 아래에 짧은 글과 키워드
  outside: {
    title: "Outside the Lab",
    text: ["I also teach Korean at a community language school, and I like to travel when I can."],
    tags: ["Music", "Design", "Teaching", "Travel"],
  },

  // 음악 매거진 경력 (Outside the Lab 맨 위에 나와요)
  editorial: {
    label: "May 2023 – Present",
    name: "Independent Music Publication, Seoul",
    role: "Founding member · Editor & Designer",
    points: [
      "Served as editor-in-chief during the publication's first year.",
      "Grew the platform to **60K+ followers**, averaging about **1M organic views** a month.",
      "Partner with labels and companies across the Korean and global music industry, like {{morevision}} and **POV**.",
      "Interview artists and write album reviews, features, and editorial columns.",
    ],
  },

  // 인생 앨범. image에 "images/albums/파일이름.jpg" 를 넣으면 커버가 보여요.
  albumsTitle: "Favourite Albums",
  albums: [
    { title: "Album title", artist: "Artist", year: "Year", image: "" },
    { title: "Album title", artist: "Artist", year: "Year", image: "" },
    { title: "Album title", artist: "Artist", year: "Year", image: "" },
    { title: "Album title", artist: "Artist", year: "Year", image: "" },
    { title: "Album title", artist: "Artist", year: "Year", image: "" },
    { title: "Album title", artist: "Artist", year: "Year", image: "" },
    { title: "Album title", artist: "Artist", year: "Year", image: "" },
    { title: "Album title", artist: "Artist", year: "Year", image: "" },
    { title: "Album title", artist: "Artist", year: "Year", image: "" },
    { title: "Album title", artist: "Artist", year: "Year", image: "" },
  ],

  // 영화. image에 "images/films/파일이름.jpg" 를 넣으면 포스터가 보여요.
  filmsTitle: "Favourite Films",
  films: [
    { title: "Film title", director: "Director", year: "Year", image: "" },
    { title: "Film title", director: "Director", year: "Year", image: "" },
    { title: "Film title", director: "Director", year: "Year", image: "" },
    { title: "Film title", director: "Director", year: "Year", image: "" },
    { title: "Film title", director: "Director", year: "Year", image: "" },
    { title: "Film title", director: "Director", year: "Year", image: "" },
  ],
};
