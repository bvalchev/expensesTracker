package com.uni.model;

import lombok.Data;

@Data
public class CurrencyConvertRequest {

    public String currencyTo;
    public String currencyFrom;
    public double valueFrom;
}
