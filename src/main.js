import { createApp } from "vue";
import { inject } from "@vercel/analytics";
import App from "./App.vue";
import "./styles/main.css";
import "./utils/tracking";

if (!window.__IS_PRERENDER__) inject();
createApp(App).mount("#app");
