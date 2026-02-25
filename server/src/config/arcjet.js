import { ARCJET_KEY } from "../constants/env.js";
import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import { isSpoofedBot } from "@arcjet/inspect";

const aj = arcjet({
  key: ARCJET_KEY,
  rules: [
    shield({ mode: "DRY_RUN" }),

    detectBot({
      mode: "DRY_RUN",

      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    slidingWindow({
      mode: "DRY_RUN",
      max: 5,
      interval: 60,
    }),
  ],
});

export default aj;
