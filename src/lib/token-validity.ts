export function isTokenExpired(token: string) {
  try {
    const tokenParts = token.split(".");
    const payload = JSON.parse(atob(tokenParts[1]));

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime; // Token is expired if exp is LESS than current time
  } catch (error) {
    console.error("Invalid token:", error);
    return true; // Treat invalid tokens as expired
  }
}
