package com.uni.model;

public class CompletedPlan {

    public String email;
    public String plan;
    public int amount;

    public CompletedPlan(String email, String plan, int amount) {
        this.email = email;
        this.plan = plan;
        this.amount = amount;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPlan() {
        return plan;
    }

    public void setPlan(String plan) {
        this.plan = plan;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }
}
