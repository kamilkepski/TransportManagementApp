package me.kepski.transport.dto;

public class PasswordRequest {
    private String token;
    private String password;

    public PasswordRequest() {
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}