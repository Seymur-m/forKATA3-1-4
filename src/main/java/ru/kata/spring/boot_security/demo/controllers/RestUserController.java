package ru.kata.spring.boot_security.demo.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserServiceImpl;

import java.util.List;

@RestController
public class RestUserController {

    @Autowired
    private UserServiceImpl userServiceImpl;

    @GetMapping("/admin/rest/")
    public List<User> usersAndCurrentUser() {
        return userServiceImpl.findAll();
    }

    @GetMapping("/admin/rest/{id}")
    public User forAdmin(@PathVariable Long id) {
        return userServiceImpl.findById(id);
    }

    @GetMapping("/user/rest/")
    public User forUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping("/admin/rest/save")
    public HttpStatus saveUser(@RequestBody User user) {
        userServiceImpl.saveUserWithRole(user);
        return HttpStatus.OK;
    }

    @DeleteMapping("/admin/rest/delete/{id}")
    public HttpStatus deleteUser(@PathVariable Long id) {
        userServiceImpl.delete(id);
        return HttpStatus.OK;
    }
}
