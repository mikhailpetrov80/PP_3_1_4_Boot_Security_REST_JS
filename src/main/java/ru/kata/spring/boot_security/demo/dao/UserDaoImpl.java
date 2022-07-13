package ru.kata.spring.boot_security.demo.dao;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Collections;
import java.util.List;

@Repository
public class UserDaoImpl implements UserDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @SuppressWarnings("unchecked")
    public List<User> getListUsers() {
        return entityManager.createQuery("from User").getResultList();
    }

    @Override
    public void addUser(User user) {
        user.setRoles(Collections.singleton(new Role(1, "ROLE_USER")));
        entityManager.persist(user);
    }

    @Override
    public User getUserId(long id) {

        return entityManager.createQuery("from User user where user.id = :id", User.class)
                .setParameter("id", id).getSingleResult();
    }

    @Override
    public void deleteUserId(long id) {
        entityManager.remove(getUserId(id));
    }

    @Override
    public void updateUser(User user) {
        entityManager.merge(user);
    }

    @Override
    public User getUserUsername(String username) {
        return entityManager.createQuery("from User user where user.username = :username", User.class)
                .setParameter("username", username).getSingleResult();
    }
}
