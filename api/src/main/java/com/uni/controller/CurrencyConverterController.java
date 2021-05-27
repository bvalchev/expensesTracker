package com.uni.controller;

import com.uni.model.CurrencyConvertRequest;
import com.uni.model.CurrencyConvertResponse;
import com.uni.model.GetCurrencyListResponse;
import com.uni.service.CurrencyConverterClient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/currency-converter")
public class CurrencyConverterController {

    @Autowired
    private CurrencyConverterClient client;

    @CrossOrigin(origins = "*")
    @PostMapping
    public GetCurrencyListResponse getCurrencyList() {
        return client.getCurrencies();
    }

    @CrossOrigin(origins = "*")
    @PostMapping(value = "/convert")
    public CurrencyConvertResponse convert(@RequestBody CurrencyConvertRequest request) {
        return client.convertCurrency(request.getCurrencyTo(), request.getCurrencyFrom());
    }
}
