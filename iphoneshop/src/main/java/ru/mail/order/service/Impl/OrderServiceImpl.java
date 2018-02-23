package ru.mail.order.service.Impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.mail.order.DAO.OrderDAO;
import ru.mail.order.service.OrderService;
import ru.mail.order.DAO.model.Order;
import ru.mail.phone.DAO.PhoneDAO;
import ru.mail.rate.service.RateService;

import javax.validation.ValidationException;
import java.io.FileNotFoundException;
import java.math.BigDecimal;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Service("OrderService")
public class OrderServiceImpl implements OrderService {


    private final OrderDAO orderDAO;
    private final PhoneDAO phoneDAO;
    private final RateService rateService;
    private final String EMAIL_PATTERN="^(.+)@(.+)$";
    private final String CARD_NUMBER_PATTERN="\\d{13,16}";
    private final String ADMIN_CARD_MUMBER_PATTERN="\\d{4}";
    private final String CARD_HOLDER_PATTERN="^[a-zA-Z'][a-zA-Z-' ]+[a-zA-Z']?$";
    private final String CVV_PATTERN="\\d{2,3}";
    private final String CURRENCY_PATTERN="\\D{3,4}";

    private static final Logger logger = Logger.getLogger(OrderServiceImpl.class);


    @Autowired
    public OrderServiceImpl(OrderDAO orderDAO, PhoneDAO phoneDAO, RateService rateService) {
        this.orderDAO = orderDAO;
        this.phoneDAO = phoneDAO;
        this.rateService = rateService;
    }

    /**
     * getting all orders
     * @return list of orders
     */
    @Override
    public List<Order> list() {
        logger.debug("getting all orders");
        return orderDAO.list();
    }

    /**
     * cheking is order from UI valid, encoding card number, setting price to order
     * @param order - order from UI
     * @return saved order
     * @throws ValidationException - throws if rate isn't valid
     */
    @Override
    public Order save(Order order) throws ValidationException, FileNotFoundException {

        logger.debug("checking order");
        checkOrder(order);

        logger.debug("encoding and setting card number");
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        order.setCardNumber(passwordEncoder.encode(order.getCardNumber()));

        logger.debug("getting phone by id");
        BigDecimal phonePrice=phoneDAO.findOne(order.getPhone().getId()).getPrice();

        logger.debug("setting order price");
        order.setPriceUSD(phonePrice);

        logger.debug("checking user currency price");
        if(order.getCurrency().equals("USD")){
           order.setPriceUserCurrency(phonePrice);

        }else{
            BigDecimal rate=rateService.getRate(order.getCurrency());

            if(rate!=null){
                order.setPriceUserCurrency(phonePrice.multiply(rate));
            }else{
                throw new ValidationException("rate doesn't exist");
            }

        }
        return orderDAO.save(order);
    }

    /**
     * checking order's fields by validation patterns
     * @param order order from UI
     * @throws ValidationException  - throws if any field isn't valid
     */
    private void checkOrder (Order order) throws ValidationException{

        logger.debug("validation order");

        Pattern patternEmail=Pattern.compile(EMAIL_PATTERN);
        Matcher matcherEmail=patternEmail.matcher(order.getEmail());
        if(order.getEmail()==null || !matcherEmail.matches()){
            throw new ValidationException("wrong email");
        }

        Pattern patternCardNumber=Pattern.compile(CARD_NUMBER_PATTERN);
        Matcher matcherCardNumber=patternCardNumber.matcher(order.getCardNumber());
        if(order.getCardNumber()==null || !matcherCardNumber.matches()){
            throw new ValidationException("wrong card number");
        }

        Pattern patternAdminCardNumber=Pattern.compile(ADMIN_CARD_MUMBER_PATTERN);
        Matcher matcherAdminCardNumber=patternAdminCardNumber.matcher(order.getAdminCardNumber());
        if(order.getAdminCardNumber()==null || !matcherAdminCardNumber.matches()){
            throw new ValidationException("wrong admin card number");
        }

        Pattern patternCardHolder=Pattern.compile(CARD_HOLDER_PATTERN);
        Matcher matcherCardHolder=patternCardHolder.matcher(order.getCardHolder());
        if(order.getCardHolder()==null || !matcherCardHolder.matches()){
            throw new ValidationException("wrong card holder");
        }

        Pattern patternCVV=Pattern.compile(CVV_PATTERN);
        Matcher matcherCVV=patternCVV.matcher(order.getCvv());
        if(order.getCvv()==null || !matcherCVV.matches()){
            throw new ValidationException("wrong cvv");
        }

        Pattern patternCurrency=Pattern.compile(CURRENCY_PATTERN);
        Matcher matcherCurrency=patternCurrency.matcher(order.getCurrency());
        if(order.getCurrency()==null || !matcherCurrency.matches()){
            throw new ValidationException("wrong currency");
        }
    }
}
