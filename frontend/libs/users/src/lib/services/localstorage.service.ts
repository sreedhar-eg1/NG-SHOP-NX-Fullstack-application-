import { Injectable } from '@angular/core';

const TOKEN_KEY = 'ngshop_jwt_token';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  isValidToken(): boolean {
    const token = this.getToken();

    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Math.floor(Date.now() / 1000) > payload.exp;
    } catch {
      return false;
    }
  }

  decodeToken(): { userId: string; isAdmin: boolean; exp: number } | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
}
