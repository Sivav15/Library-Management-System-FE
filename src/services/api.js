let host;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  host = "http://localhost:4000";
} else {
  host = "";
}

// Authenticate
export const register_api = `${host}/api/auth/register`;
export const login_api = `${host}/api/auth/login`;
export const googleCallback_api = `${host}/api/auth/google/register`;
