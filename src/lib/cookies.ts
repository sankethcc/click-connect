export const setCookie = (
    name: string,
    value: string,
    days = 7,
    secure = false,
    sameSite: 'Strict' | 'Lax' | 'None' = 'Lax'
): void => {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    let cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/;`;
    if (secure && window.location.protocol === 'https:') {
        cookieString += ' Secure;';
    }
    // Set SameSite policy
    cookieString += ` SameSite=${sameSite};`;
    document.cookie = cookieString;
};


export const getCookie = (name: string): unknown | null => {
    if (typeof document === 'undefined') return null; // SSR-safe check

    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    let decodedValue = null;
    if (match) {
        try {
            decodedValue = decodeURIComponent(match[2]);
            return JSON.parse(decodedValue);
        } catch (error) {
            console.log(error);
            return decodedValue;
        }
    }
    return null;
};


export const removeCookie = (
    name: string,
    secure: boolean = window.location.protocol === 'https:',
    sameSite: 'Strict' | 'Lax' | 'None' = 'Lax',
    path: string = '/'
): void => {
    const cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; SameSite=${sameSite}; ${secure ? 'Secure;' : ''
        }`;
    document.cookie = cookieString;
};
