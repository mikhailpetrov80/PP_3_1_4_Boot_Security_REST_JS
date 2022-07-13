package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;

    @Autowired
    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public String printUsers(Model userModel) {
        userModel.addAttribute("users", userService.getListUsers());
        return "admin/users";
    }

    @GetMapping("/addUser")
    public String newUser(Model userModel) {
        userModel.addAttribute("user", new User());
        return "admin/addUser";
    }

    @PostMapping("/users")
    public String createUser(@ModelAttribute("user") User user) {
        userService.addUser(user);
        return "redirect:/admin/users";
    }

    @GetMapping("/users/{id}")
    public String getByIdUser(@PathVariable("id") long id, Model userModel) {
        userModel.addAttribute("user", userService.getUserId(id));
        return "admin/user";
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable("id") long id) {
        userService.deleteUserId(id);
        return "redirect:/admin/users";
    }

    @GetMapping("/users/{id}/update")
    public String editUser(Model userModel, @PathVariable("id") long id) {
        userModel.addAttribute("user", userService.getUserId(id));
        return "admin/update";
    }


    @PatchMapping("/users/{id}/admin/users")
    public String updateUser(@ModelAttribute("user") User user) {
        userService.updateUser(user);
        return "redirect:/admin/users";
    }

}
