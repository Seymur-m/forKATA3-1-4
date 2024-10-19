package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserServiceIntr extends UserDetailsService {
    List<User> findAll();
    void save(User user);
    User findById(Long id);
    void update(User user);
    void delete(Long id);
}