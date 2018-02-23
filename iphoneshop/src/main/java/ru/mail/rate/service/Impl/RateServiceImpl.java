package ru.mail.rate.service.Impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mail.phone.service.Impl.PhoneServiceImpl;
import ru.mail.rate.DAO.RateDAO;
import ru.mail.rate.service.RateService;

import java.io.FileNotFoundException;
import java.math.BigDecimal;


@Service("RateService")
public class RateServiceImpl implements RateService {

    private final RateDAO rateDAO;
    private static final Logger logger = Logger.getLogger(PhoneServiceImpl.class);


    @Autowired
    public RateServiceImpl(RateDAO rateDAO) {
        this.rateDAO = rateDAO;
    }


    /**
     * getting requaried rate
     * @param currency from UI - rate kind which user want to use
     * @return rate
     */
    @Override
    public BigDecimal getRate(String currency) throws FileNotFoundException {
        logger.debug("getting requaried rate");
        return rateDAO.getRate().getRates().get(currency);
    }
}
