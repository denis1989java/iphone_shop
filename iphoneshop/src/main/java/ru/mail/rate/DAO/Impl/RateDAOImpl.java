package ru.mail.rate.DAO.Impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import ru.mail.phone.service.Impl.PhoneServiceImpl;
import ru.mail.rate.DAO.RateDAO;
import ru.mail.rate.DAO.model.Rate;

import javax.validation.ValidationException;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URL;


@Service("RateDAO")
public class RateDAOImpl implements RateDAO {


    private static final Logger logger = Logger.getLogger(RateDAOImpl.class);

    /**
     * getting json from url with rates information
     * @return Rate with full fields
     */
    @Override
    public Rate getRate() throws FileNotFoundException {

        ObjectMapper mapper = new ObjectMapper();

        Rate rate;

        try {
            logger.debug("getting rates by url");
            rate = mapper.readValue(new URL("http://localhost:3000/nodeapi/v1/currency"), Rate.class);
        } catch (IOException e) {
            logger.debug("getting rates by url exception");
            throw new FileNotFoundException("cannot connect to remote url to get rates file");
            // TODO Auto-generated catch block
        }
        return rate;
    }
}
