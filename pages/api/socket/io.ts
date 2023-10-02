import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerSocket } from "socket.io";

import { NextApiResponseServerSocket } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const socketIoHandler = (
  req: NextApiRequest,
  res: NextApiResponseServerSocket
) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerSocket(httpServer, {
      path,
      //@ts-ignore
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
    res.end();
  }
};

export default socketIoHandler;
