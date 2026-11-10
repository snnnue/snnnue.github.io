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
  projects: true,
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
  { date: "Nov 2026", text: "Won **1st Place** at Sheridan Datathon 2026 with [READYation](https://devpost.com/software/nasa-omni-forecast-to-predict-power-outages) 🏆" },
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
// 프로젝트 (논문 목록 형식). people에서 me: true인 이름이 굵게 표시돼요.
export const projects = [
  {
    label: "Sheridan Datathon 2026 · 1st Place",
    slug: "readyation", // 이 이름으로 상세 페이지가 생겨요 (사이트주소/#readyation)
    title: "READYation: Built to Protect the People Who Explore for Us",
    people: [{ name: "David Kang", me: true }, { name: "Aaron Jang" }, { name: "Taryn Chong" }, { name: "Hee-Won Jeong" }],
    text: "Forecasts solar radiation storms 24 hours ahead from NASA OMNI proton flux data and turns each forecast into a crew alert on an astronaut's helmet visor.",
    role: "Data preprocessing and validation, 3D helmet visualization, alert scale design", // 목록에 보이는 한 줄 역할
    image: "images/readyation.jpg",
    links: [
      { label: "Devpost", url: "https://devpost.com/software/nasa-omni-forecast-to-predict-power-outages" },
      { label: "Mission console", url: "https://snnnue.github.io/readyation/console" },
      { label: "Helmet demo", url: "https://snnnue.github.io/readyation/" },
      { label: "Code", url: "https://github.com/AaronJang22/Sheridan-Datathon-2026" },
    ],
    // 상세 페이지 내용. 각 섹션의 text는 문단 목록, points는 불렛 목록이에요.
    details: {
      video: "7mICMH5P8jM", // YouTube 영상 ID
      // 내 역할 (상세 페이지 위쪽 박스에 나와요)
      role: [
        "Built the data foundation by cleaning and preprocessing about 1.7 million five-minute NASA OMNI records, pruning irrelevant variables and restructuring the data for forecasting",
        "Audited and validated the final dataset so the model trained and was tested on accurate, complete inputs",
        "Designed and built the interactive 3D helmet visualization in three.js that turns READYation forecasts into tiered visor alerts for astronauts",
        "Helped calibrate the alert scale connecting the forecast model to the interface",
        "Authored the project write-up and Devpost submission presented to the judges",
      ],
      tagline: "Solar radiation hits astronauts before the geomagnetic storm alert does. READYation forecasts these radiation storms from NASA data and puts the warning on the helmet visor.",
      images: [{ src: "images/readyation-console.jpg", caption: "Mission console replaying the September 2017 storm" }],
      stats: [
        { value: "14 / 14", label: "storms warned in advance (2014 to 2020 test data)" },
        { value: "3.8 h", label: "median warning time, vs 2.2 h from flux alone" },
        { value: "1.7M", label: "five-minute NASA OMNI records analyzed" },
      ],
      sections: [
        {
          title: "Inspiration",
          text: [
            "We started with questions about how space weather affects health on Earth and found no measurable effect. That pointed us to the people who actually face the risk. Astronauts work beyond Earth's magnetic field, and solar proton storms can reach them within hours, often with no geomagnetic alert at all.",
          ],
        },
        {
          title: "What it does",
          text: [
            "READYation reads recent proton flux, forecasts it 24 hours ahead, and raises tiered crew alerts. A mission console replays real storms from 2014 to 2020, and a 3D helmet shows how each alert would appear on the visor.",
          ],
          points: [
            "**Yellow WATCH** when a storm is likely within hours",
            "**Orange STORM** at NOAA S1 (10 pfu)",
            "**Red DANGER** at NOAA S3 (1,000 pfu), end EVA and shelter",
          ],
        },
        {
          title: "How we built it",
          points: [
            "About 1.7 million five-minute NASA OMNI records, analyzed in Python with pandas, NumPy and SciPy",
            "IBM Granite TinyTimeMixer r2, fine-tuned on 2010 to 2013 and tested on 2014 to 2020",
            "Helmet visualization built with three.js and hosted on GitHub Pages",
          ],
        },
        {
          title: "Results",
          text: [
            "On the 2014 to 2020 test period, READYation warned ahead of all 14 radiation storms, with a median lead time of 3.8 hours compared with 2.2 hours from flux alone. It also raised 22 watches that did not become storms.",
          ],
        },
        {
          title: "Challenges",
          points: [
            "A steep learning curve, since most of us were new to data science",
            "Null results from our first health ideas",
            "An early analysis error with missing data, which we fixed so gaps show as NO DATA instead of safe",
            "Strong storms are rare, so we focused on honest testing and reporting uncertainty",
          ],
        },
        {
          title: "What we learned",
          points: [
            "Near-zero correlation does not rule out a link, because timing matters",
            "Missing data is not safe data",
            "Models have to be tested on future data",
            "Null results can lead to better questions",
          ],
        },
        {
          title: "What's next",
          points: [
            "Add recent solar cycle data, including the 2024 superstorm",
            "Study higher-energy protons and estimate biological dose",
            "Connect to live NOAA data",
          ],
        },
        {
          title: "Limits",
          text: [
            "The test set is small, 10 MeV flux is not a radiation dose, and the protons in the helmet demo are illustrative. This is a datathon project, not an operational tool.",
          ],
        },
      ],
      builtWith: ["Python", "IBM Granite", "Colab", "Claude", "Gemini", "three.js"],
    },
  },
  {
    label: "PSL498Y1 · In Progress",
    title: "Characterizing the Temporal Dynamics of Npas4 Expression in the Lateral Amygdala Following Fear Memory Encoding and Retrieval",
    people: [{ name: "David Kang", me: true }],
    meta: "UofT PSL498Y1 Project in Physiology · Josselyn–Frankland Lab",
    image: "",
    links: [{ label: "Poster", url: "" }],
  },
];

// ─────────────────────────────────────────────────────────────
//  INTERESTS 페이지 (메뉴에서 클릭하면 따로 열리는 화면)
// ─────────────────────────────────────────────────────────────
export const interests = {
  // OUTSIDE THE LAB: 위에 음악 매거진 경력, 아래에 짧은 글과 키워드
  outside: {
    title: "Outside the Lab",
    text: [], // 짧은 글을 넣고 싶으면 따옴표 안에 문장을 적으세요
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
      "Work with labels and companies across the Korean and global music industry, like {{morevision}} and **POV**.",
      "Interview artists and write album reviews, features, and editorial columns.",
    ],
  },

  // 인생 앨범. image에 "images/albums/파일이름.jpg" 를 넣으면 커버가 보여요.
  albumsTitle: "Favourite Albums",
  albums: [
    { title: "Because I Love You", artist: "Yoo Jae Ha", year: "1987", image: "images/albums/because-i-love-you.jpg" },
    { title: "The Light and The Salt Vol. 1", artist: "The Light and The Salt", year: "1990", image: "images/albums/light-and-salt-vol1.jpg" },
    { title: "PARTYNEXTDOOR TWO", artist: "PARTYNEXTDOOR", year: "2014", image: "images/albums/partynextdoor-two.jpg" },
    { title: "T R A P S O U L", artist: "Bryson Tiller", year: "2015", image: "images/albums/trapsoul.jpg" },
    { title: "Views", artist: "Drake", year: "2016", image: "images/albums/views.jpg" },
    { title: "Blonde", artist: "Frank Ocean", year: "2016", image: "images/albums/blonde.jpg" },
    { title: "boy.", artist: "offonoff", year: "2017", image: "images/albums/boy.jpg" },
    { title: "Itadaki Girl (Original Motion Picture Soundtrack)", artist: "Hideyuki Hashimoto", year: "2019", image: "images/albums/itadaki-girl.jpg" },
    { title: "Donda", artist: "Kanye West", year: "2021", image: "images/albums/donda.jpg" },
    { title: "Two Star & The Dream Police", artist: "Mk.gee", year: "2024", image: "images/albums/two-star-and-the-dream-police.jpg" },
  ],

  // 영화. image에 "images/films/파일이름.jpg" 를 넣으면 포스터가 보여요.
  filmsTitle: "Favourite Films",
  films: [
    { title: "Punch-Drunk Love", director: "Paul Thomas Anderson", year: "2002", image: "images/films/punch-drunk-love.jpg" },
    { title: "Bleak Night", director: "Yoon Sung-hyun", year: "2011", image: "images/films/bleak-night.jpg" },
    { title: "Mommy", director: "Xavier Dolan", year: "2014", image: "images/films/mommy.jpg" },
    { title: "Phantom Thread", director: "Paul Thomas Anderson", year: "2017", image: "images/films/phantom-thread.jpg" },
    { title: "You Can See Everything", director: "Nathan Fielder & Lance Oppenheim", year: "2026", image: "images/films/you-can-see-everything.jpg" },
  ],
};
