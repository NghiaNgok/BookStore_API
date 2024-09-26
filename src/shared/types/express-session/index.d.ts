import 'express-session';

declare module 'express-session' {
  interface SessionData {
    admin: { [key: string]: any };
  }
}
