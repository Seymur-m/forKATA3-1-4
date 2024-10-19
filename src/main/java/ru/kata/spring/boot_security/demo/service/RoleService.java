package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.repositories.RoleRepository;
import java.util.List;


@Service
public class RoleService implements  RoleServiceIntr{

    @Autowired
    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }


    @Override
    public void save(Role role) {
        roleRepository.saveAndFlush(role);
    }

    @Override
    public void saveAll(List<Role> roles) {
        roleRepository.saveAllAndFlush(roles);
    }

}
