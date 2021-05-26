package com.uni.controller;

import com.uni.model.CompletedPlan;
import com.uni.service.EmailService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/completed-plans")
public class EmailController {

    @CrossOrigin(origins = "*")
    @PostMapping
    public CompletedPlan sendEmail(@RequestBody CompletedPlan completedPlan) {
        EmailService service = new EmailService(completedPlan.getEmail(), completedPlan.getPlan(),
                completedPlan.getAmount());
        service.sendEmail();

        return completedPlan;
    }
}