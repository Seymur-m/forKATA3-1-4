package ru.kata.spring.boot_security.demo.init;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repositories.RoleRepository;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.util.Arrays;


@Component
public class DataInitializer {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    @PostConstruct
    public void init() {

        Role adminRole = new Role("ADMIN");
        Role userRole = new Role("USER");
        roleRepository.save(adminRole);
        roleRepository.save(userRole);


        User user1 = new User();
        user1.setName("Admin User");
        user1.setEmail("admin@example.com");
        user1.setUsername("admin");
        user1.setPassword(passwordEncoder.encode("admin"));
        user1.setRoles(Arrays.asList(adminRole));


        Hibernate.initialize(user1.getRoles());
        userRepository.save(user1);


        User user2 = new User();
        user2.setName("Regular User");
        user2.setEmail("user@example.com");
        user2.setUsername("user");
        user2.setPassword(passwordEncoder.encode("user"));
        user2.setRoles(Arrays.asList(userRole));

        Hibernate.initialize(user2.getRoles());
        userRepository.save(user2);
    }
}