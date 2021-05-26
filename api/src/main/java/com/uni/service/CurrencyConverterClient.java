package com.uni.service;

import com.uni.model.Convert;
import com.uni.model.ConvertResponse;
import com.uni.model.CurrencyConvertResponse;
import com.uni.model.GetCurrencyList;
import com.uni.model.GetCurrencyListResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ws.client.core.support.WebServiceGatewaySupport;
import org.springframework.ws.soap.client.core.SoapActionCallback;

public class CurrencyConverterClient extends WebServiceGatewaySupport {

    private static final String API_KEY = System.getProperty("api.key", "daa5d569caa74b7fa3727f6fa0fea967");
    private static final double VALUE_FROM = 7;
    private static final Logger log = LoggerFactory.getLogger(CurrencyConverterClient.class);

    public GetCurrencyListResponse getCurrencies() {
        GetCurrencyList request = new GetCurrencyList();
        log.info("Requesting list of available currencies.");

        return (GetCurrencyListResponse) getWebServiceTemplate()
                .marshalSendAndReceive("http://mondor.org/ces/rates.asmx?WSDL", request,
                        new SoapActionCallback(
                                "http://mondor.org/GetCurrencyList"));
    }

    public CurrencyConvertResponse convertCurrency(String currencyTo, String currencyFrom) {
        Convert request = new Convert();
        request.setCurrencyTo(currencyTo);
        request.setCurrencyFrom(currencyFrom);
        request.setUserKey(API_KEY);
        request.setValueFrom(VALUE_FROM);
        log.info("Requesting conversion from: {} to {}", currencyTo, currencyFrom);

        ConvertResponse response = (ConvertResponse) getWebServiceTemplate()
                .marshalSendAndReceive("http://mondor.org/ces/rates.asmx?WSDL", request,
                        new SoapActionCallback(
                                "http://mondor.org/Convert"));

        CurrencyConvertResponse result = new CurrencyConvertResponse();
        result.setConversionResult(response.getConvertResult());

        return result;
    }
}
