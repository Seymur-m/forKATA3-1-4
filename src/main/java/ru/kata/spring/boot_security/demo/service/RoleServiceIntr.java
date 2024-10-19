package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.Role;

import java.util.List;

public interface RoleServiceIntr {
    void save(Role role);
    void saveAll(List<Role> roles);
}