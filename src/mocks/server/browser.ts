import { setupWorker } from "msw";
import { handlers } from "../server/handlers.js";

export const worker = setupWorker(...handlers);
