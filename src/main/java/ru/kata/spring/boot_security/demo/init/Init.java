package ru.kata.spring.boot_security.demo.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repositories.RoleRepository;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;

import java.util.List;


@Component
public class Init implements CommandLineRunner {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public Init(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        Role adminRole = new Role("ROLE_ADMIN");
        Role userRole = new Role("ROLE_USER");
        adminRole = roleRepository.save(adminRole);
        userRole = roleRepository.save(userRole);


        User admin = new User("admin", passwordEncoder.encode("admin"), List.of());
        User user = new User("user", passwordEncoder.encode("user"), List.of());
        admin = userRepository.save(admin);
        user = userRepository.save(user);


        admin.setRoles(List.of(adminRole));
        user.setRoles(List.of(userRole));
        userRepository.save(admin);
        userRepository.save(user);
    }
}
