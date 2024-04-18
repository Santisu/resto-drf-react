

export interface AuthTokens {
    access_token: AccessToken
    refresh_token: RefreshToken
}
export interface AccessTokenResponse {
    access_token: AccessToken
}

export type AccessToken = string
export type RefreshToken = string
