package ru.mail.rate.service;

import java.io.FileNotFoundException;
import java.math.BigDecimal;


public interface RateService {
    BigDecimal getRate(String currency) throws FileNotFoundException;
}
