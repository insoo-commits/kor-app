/* app-config (PhasaKAO): the values that differ between apps. The shared parts in src/core/ read only this. */
window.APPCFG = {
  app: "PhasaKAO",
  store: "pk-",                 /* this app's storage prefix (pk-intro …); core parts that save new things use it */
  prefs: { theme: "ໜ້າຈໍ 화면", themes: ["ອັດຕະໂນມັດ", "☀ ແຈ້ງ", "☾ ມືດ"], fz: "ຂະໜາດຕົວໜັງສື 글자 크기" },   /* core prefs: labels of the theme / text size buttons */
  ptr: { bg: "rgba(40,44,52,.88)", go: "rgba(26,115,232,.95)" },   /* core ptr: pull-to-refresh button colour, and once far enough */
  stick: { title: function(){ var B = document.getElementById("bselBtn"), q = function(c){ return (B.querySelector(c) || {}).textContent || ""; };
            return B.querySelector(".ddk") ? (q(".ddn") + " " + q(".ddk") + (q(".ddo") ? " (" + q(".ddo") + ")" : "")).trim() : B.textContent.trim(); },
           watch: ["bselBtn"] },   /* core stick: the bar's lesson line = the lesson picker's text */
  vol: { sub: "음량" }          /* core vol: small Korean label under the volume slider's title */
};
