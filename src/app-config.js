/* app-config (PhasaKAO): the values that differ between apps. The shared parts in src/core/ read only this. */
window.APPCFG = {
  app: "PhasaKAO",
  store: "pk-",                 /* this app's storage prefix (pk-intro …); core parts that save new things use it */
  statsPublic: true,            /* build.js: show 도움말 > 학습 통계 (RYU 2026-11-25) */
  snap: { key: "kolearn-snap" },     /* core snap: the last screen; build.js reads the same key in index.html */
  stats: {                      /* core stats: usage statistics, the 학습 통계 page and the survey */
    url: "https://script.google.com/macros/s/AKfycbzWGHS_COZ7w2fJ02L6mzJ_jfhOekECXCmB5E03Fja3ozVJ2tq3NLEfv_dWorpfcXWO/exec",   // RYU 2026-11-26: own sheet (a copy of the KoJey sheet)
    key: "kolearn-lo",          /* storage: kolearn-lo-stats, -id, -statspage, -survey, -svq (unchanged) */
    AC: {K1: "var(--k1)", K2: "var(--k2)", K3: "var(--k3)", K4: "var(--k4)", K5: "var(--k5)", K6: "var(--k6)", K7: "var(--k7)", K8: "var(--k8)", K9: "var(--k9)", LS: "var(--k7)", TP: "var(--k3)", KR: "var(--k5)", JB: "var(--k4)", HP: "var(--muted)"},
    t: { scale: "ແກນຂວາ, ສູງສຸດ", learners: "ຜູ້ຮຽນ", tDevices: "ຜູ້ຮຽນ", tDevicesSub: "ອຸປະກອນ", tBack: "ກັບມາອີກ", tBackSub: "2 ມື້ຂຶ້ນໄປ",
      tLessons: "ບົດທີ່ເປີດ", tPer: "ບົດຕໍ່ຜູ້ຮຽນ", tQuiz: "ແບບທົດສອບທີ່ເຮັດແລ້ວ", tQuizAvg: "ຄະແນນສະເລ່ຍ", tTopik: "ຊຸດ TOPIK", tPlays: "ການຫຼິ້ນສຽງ",
      tSpeak: "ຝຶກເວົ້າ", avg: "ສະເລ່ຍ", daily: "ທຸກມື້", monthly: "ທຸກເດືອນ", cLearners: "ຜູ້ຮຽນ", cLessons: "ບົດທີ່ເປີດ", top: "ບົດທີ່ເປີດຫຼາຍທີ່ສຸດ",
      areas: "ຕາມໝວດ", devices: "ອຸປະກອນ", os: "ລະບົບປະຕິບັດການ", survey: "ຄວາມພໍໃຈ", sAnswers: "ຄຳຕອບ", sAvg: "ດາວສະເລ່ຍ", sRec: "ຈະແນະນຳ",
      quizHist: "ຄະແນນແບບທົດສອບ", hours: "ເວລາຮຽນ (ເວລາເກົາຫຼີ)", updated: "ອັບເດດ", since: "ນັບຕັ້ງແຕ່", totals: "ສະເພາະຍອດລວມ: ບໍ່ມີຊື່ ແລະ ບໍ່ມີຜົນຂອງຄົນໃດຄົນໜຶ່ງ.",
      loading: "ກຳລັງໂຫຼດສະຖິຕິ…", loadFail: "ໂຫຼດສະຖິຕິບໍ່ໄດ້. ກະລຸນາລອງໃໝ່ເມື່ອມີອິນເຕີເນັດ.",
      thanks: "ຂອບໃຈສຳລັບຄຳຕອບ!", stars: "ດາວ", nStars: "ດາວ", yes: "ແມ່ນ", maybe: "ບໍ່ແນ່ໃຈ", no: "ບໍ່", wish: "ຢາກໃຫ້ແອັບດີຂຶ້ນແນວໃດ? (ບໍ່ບັງຄັບ)",
      qMenu: "ໝວດໃດຊ່ວຍໄດ້ຫຼາຍທີ່ສຸດ?", qRec: "ຈະແນະນຳແອັບນີ້ໃຫ້ໝູ່ບໍ່?", send: "ສົ່ງ", later: "ພາຍຫຼັງ", how: "ແອັບນີ້ເປັນແນວໃດ?", howKo: "이 앱 어때요?" }
  },
  keys: { title: "ປຸ່ມລັດແປ້ນພິມ",          /* core keys: the ? help card */
    rows: [["Space", "ຢຸດຊົ່ວຄາວ · ສືບຕໍ່ (ບໍ່ມີສຽງ: ຟັງບົດນີ້)", "일시정지 · 재개"], ["C", "ຟັງຕໍ່ເນື່ອງ", "연속 재생"], ["G", "ຟັງບົດນີ້", "묶음 재생"],
          ["Esc", "ຍົກເລີກ", "정지"], ["← →", "ປະໂຫຍກກ່ອນ · ຕໍ່ໄປ", "이전 · 다음 문장"], ["< >  (, .)", "ບົດກ່ອນ · ບົດຕໍ່ໄປ", "이전 · 다음 묶음"],
          ["Enter", "ຊ້ຳອັນນີ້ບໍ່ຢຸດ · ປິດ", "지금 문장 무한 반복"], ["K", "ເປີດ · ປິດ ສຽງລາວ", "라오스어 음성 켜기 · 끄기"], ["1 ~ 5", "ຈຳນວນເທື່ອ", "반복 횟수"], ["-  =", "ຊ້າລົງ · ໄວຂຶ້ນ", "배속"],
          ["S W E", "ປະໂຫຍກ · ຄຳສັບ · ແບບທົດສອບ", "예문 · 단어 · 퀴즈"], ["?", "ເປີດ · ປິດ ລາຍການນີ້", "단축키 목록"]] },
  menu: { follow: true },       /* core menu: the row scrolls to show the pressed button */
  prefs: { theme: "ໜ້າຈໍ 화면", themes: ["ອັດຕະໂນມັດ", "☀ ແຈ້ງ", "☾ ມືດ"], fz: "ຂະໜາດຕົວໜັງສື 글자 크기" },   /* core prefs: labels of the theme / text size buttons */
  ptr: { bg: "rgba(40,44,52,.88)", go: "rgba(26,115,232,.95)" },   /* core ptr: pull-to-refresh button colour, and once far enough */
  stick: { title: function(){ var B = document.getElementById("bselBtn"), q = function(c){ return (B.querySelector(c) || {}).textContent || ""; };
            return B.querySelector(".ddk") ? (q(".ddn") + " " + q(".ddk") + (q(".ddo") ? " (" + q(".ddo") + ")" : "")).trim() : B.textContent.trim(); },
           watch: ["bselBtn"] },   /* core stick: the bar's lesson line = the lesson picker's text */
  vol: { sub: "음량" }          /* core vol: small Korean label under the volume slider's title */
};
