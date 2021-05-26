package com.uni.configuration;

import com.uni.service.CurrencyConverterClient;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;

@Configuration
public class CurrencyConverterConfiguration {

    @Bean
    public Jaxb2Marshaller marshaller() {
        Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
        marshaller.setContextPath("com.uni.model");
        return marshaller;
    }

    @Bean
    public CurrencyConverterClient currencyConverterClient(Jaxb2Marshaller marshaller) {
        CurrencyConverterClient client = new CurrencyConverterClient();
        client.setDefaultUri("mondor.org/ces");
        client.setMarshaller(marshaller);
        client.setUnmarshaller(marshaller);
        return client;
    }
}
