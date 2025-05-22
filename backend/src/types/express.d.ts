// src/types/express.d.ts
declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      role: 'ADMIN' | 'USER';
    }

    interface Request {
      user?: User;
    }
  }
}
