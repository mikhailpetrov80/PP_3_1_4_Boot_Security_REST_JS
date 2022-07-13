package ru.kata.spring.boot_security.demo.dao;

import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserDao {

    List<User> getListUsers();

    void addUser(User user);

    User getUserId(long id);

    void deleteUserId(long id);

    void updateUser(User user);

    User getUserUsername(String username);
}
