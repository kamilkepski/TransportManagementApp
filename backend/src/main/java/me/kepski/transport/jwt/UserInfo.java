package me.kepski.transport.jwt;

public class UserInfo {
    private String firstName;

    public UserInfo(String firstName) {
        this.firstName = firstName;
    }

    public String getFirstName() {
        return firstName;
    }
}
