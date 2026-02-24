import { ARCJET_KEY } from "../constants/env.js";
import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";
import { isSpoofedBot } from "@arcjet/inspect";

const aj = arcjet({
  key: ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),

    detectBot({
      mode: "LIVE",

      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    slidingWindow({
      mode: "LIVE",
      max: 100,
      interval: 60 * 1000,
    }),
  ],
});

export default aj;
