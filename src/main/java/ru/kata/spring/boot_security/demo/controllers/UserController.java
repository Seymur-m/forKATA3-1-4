package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
@RequestMapping
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public String listUsers(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        UserDetails user = userService.loadUserByUsername(userDetails.getUsername());
        model.addAttribute("users", userService.findAll());
        return "user";
    }



    @GetMapping("/admin")
    public String forAdmin(@AuthenticationPrincipal User currentUser, Model model) {
        model.addAttribute("currentuser", currentUser);
        return "users";
    }

    @GetMapping("/new")
    public String showFormForAdd(Model model) {
        User user = new User();
        model.addAttribute("user", user);
        return "add-user";
    }

    @PostMapping("/save")
    public String saveUser(User user) {
        userService.save(user);
        return "redirect:/users";
    }


    @GetMapping("/edit")
    public String showFormForUpdate(@RequestParam("userId") Long id, Model model) {
        User user = userService.findById(id);
        model.addAttribute("user", user);
        return "user-form";
    }

    @PostMapping("/update")
    public String updateUser(User user) {
        userService.update(user);
        return "redirect:/users";
    }

    @GetMapping("/delete")
    public String deleteUser(@RequestParam("userId") Long id) {
        userService.delete(id);
        return "redirect:/users";
    }
}
