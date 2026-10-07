import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      name: string;
      email: string;
      role: "admin" | "user";
      authVersion: number;
      mustChangePassword: boolean;
    };
    user: {
      sub: string;
      name: string;
      email: string;
      role: "admin" | "user";
      authVersion: number;
      mustChangePassword: boolean;
    };
  }
}

declare module "fastify" {
  interface FastifyRequest {
    articleViewer: {
      sub: string;
      email: string;
      role: "admin" | "user";
      authVersion: number;
      mustChangePassword: boolean;
    } | null;
  }
}
