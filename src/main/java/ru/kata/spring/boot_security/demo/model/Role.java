package ru.kata.spring.boot_security.demo.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.security.core.GrantedAuthority;
import javax.persistence.*;
import java.util.List;



@Entity
@Table(name = "roles")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Role implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roleName;


    @ManyToMany(mappedBy = "roles")
    @JsonIgnore
    private List<User> users;

    public Role(String name) {
        this.roleName = name;
    }

    public Role() {
    }

    @Override
    public String getAuthority() {
        if (!roleName.startsWith("ROLE_")) {
            return "ROLE_" + roleName;
        }
        return roleName;
    }

    public Long getId() {
        return id;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    @Override
    public String toString() {
        return roleName;
    }
}
