import { randomUUID } from "node:crypto";
import pino from "pino";
import pinoLogger from "pino-http";
import { IS_LOCAL } from "./constants";

function _getPino() {
  if (!IS_LOCAL) {
    return pino();
  }

  return pino({
    transport: {
      target: "pino-pretty",
    },
  });
}

export const loggingInstance = pinoLogger({
  logger: _getPino(),
  genReqId: (req, res) => {
    const existingID = req.id ?? req.headers["x-request-id"];
    if (existingID) return existingID;
    const id = randomUUID();
    res.setHeader("x-request-id", id);
    return id;
  },
});

export const logging = loggingInstance.logger;
