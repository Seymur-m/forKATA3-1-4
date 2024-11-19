package ru.kata.spring.boot_security.demo.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@RestController
public class RestUserController {

    @Autowired
    private UserService userService;


    @GetMapping("/admin/rest/")
    public List<User> usersAndCurrentUser() {
        return userService.findAll();
    }

    @GetMapping("/admin/rest/{id}")
    public User forAdmin(@PathVariable Long id) {
        return userService.findById(id);
    }

    @GetMapping("/user/rest/")
    public User forUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        return (User) userService.loadUserByUsername(userName);
    }


    @PostMapping("/admin/rest/save")
    public HttpStatus saveUser(@RequestBody User user) {
        userService.saveUserWithRole(user);
        return HttpStatus.OK;
    }

    @DeleteMapping("/admin/rest/delete/{id}")
    public HttpStatus deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return HttpStatus.OK;
    }
}


