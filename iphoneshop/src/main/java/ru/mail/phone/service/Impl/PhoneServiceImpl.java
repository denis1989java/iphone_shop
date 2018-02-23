package ru.mail.phone.service.Impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mail.order.service.Impl.OrderServiceImpl;
import ru.mail.phone.DAO.PhoneDAO;
import ru.mail.phone.service.PhoneService;
import ru.mail.phone.DAO.model.Phone;

import java.util.List;

@Service("PhoneService")
public class PhoneServiceImpl implements PhoneService {


    private static final Logger logger = Logger.getLogger(PhoneServiceImpl.class);
    private final PhoneDAO phoneDAO;

    @Autowired
    public PhoneServiceImpl(PhoneDAO phoneDAO) {
        this.phoneDAO = phoneDAO;
    }


    /**
     * getting all phones
     * @return list of phones
     */
    @Override
    public List<Phone> list() {
        logger.debug("getting all phones");
        return phoneDAO.list();
    }
}
