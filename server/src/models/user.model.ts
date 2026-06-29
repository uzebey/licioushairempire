// Shape of the JWT payload — what we encode inside the token.
// Keep it small: only what controllers actually need per-request.
export interface JwtPayload {
  userId: string;
  email: string;
  role: 'customer' | 'admin';
}

// What we send back to the client after login/register (never the hash).
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
