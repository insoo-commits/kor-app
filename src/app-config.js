/* app-config (PhasaKAO): the values that differ between apps. The shared parts in src/core/ read only this. */
window.APPCFG = {
  app: "PhasaKAO",
  store: "pk-",                 /* this app's storage prefix (pk-intro …); core parts that save new things use it */
  ptr: { bg: "rgba(40,44,52,.88)", go: "rgba(26,115,232,.95)" },   /* core ptr: pull-to-refresh button colour, and once far enough */
  vol: { sub: "음량" }          /* core vol: small Korean label under the volume slider's title */
};
