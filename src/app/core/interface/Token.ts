export interface Token {
    client_id: string;
    grant_type: 'password';
    password: string;
    username: string;
    client_secret: string;
}

export interface TokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope: null;
    refresh_token: string;
}