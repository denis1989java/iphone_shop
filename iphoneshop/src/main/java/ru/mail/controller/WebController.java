package ru.mail.controller;


import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ru.mail.order.DAO.model.Order;
import ru.mail.phone.DAO.model.Phone;
import ru.mail.order.service.OrderService;
import ru.mail.phone.service.PhoneService;

import javax.validation.ValidationException;
import java.io.FileNotFoundException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("api/v1")
public class WebController {

    private static final Logger logger = Logger.getLogger(WebController.class);
    private final PhoneService phoneService;
    private final OrderService orderService;

    @Autowired
    public WebController(PhoneService phoneService, OrderService orderService) {
        this.phoneService = phoneService;
        this.orderService = orderService;
    }


    /**
     * this method get list of phones and return response entity with it and set cash control
     * @param phones entity to return list of phones with name "phones"
     * @return list of phones
     */
    @RequestMapping("phones")
    public ResponseEntity getPhones(Map<String,List<Phone>> phones) {

        logger.debug("getting all phones");

        phones.put("phones",phoneService.list());

        return ResponseEntity.ok().cacheControl(CacheControl.maxAge(10, TimeUnit.SECONDS)).body(phones);
    }

    /**
     * this method get list of order and return response entity with it and set cash control, and set null to secure fields
     * @param securOrders entity to return list of orders with name "adminOrders"
     * @return list of orders
     */
    @RequestMapping("admin/orders")
    public ResponseEntity getOrders(Map<String,List<Order>> securOrders) {


        logger.debug("getting all orders");

        List<Order> orders=orderService.list();

        for (Order order : orders) {
            order.setCardNumber("");
            order.setCardHolder("");
            order.setCvv("");
        }

        securOrders.put("adminOrders",orders);

        return ResponseEntity.ok().cacheControl(CacheControl.maxAge(5, TimeUnit.SECONDS)).body(securOrders);
    }

    /**
     * this method save order and return response entity with it and set null to secure fields
     * @param order entity from UI to save
     * @return saved order
     */
    @RequestMapping(value = "orders",method = RequestMethod.POST)
    public ResponseEntity saveOrder(@RequestBody(required = false) Order order) {


        logger.debug("saving order: "+ order.toString());

        try {
            order=orderService.save(order);
        }catch (ValidationException e){
            logger.debug("validation exception "+e.getMessage());
            return new ResponseEntity(new ValidationException(e.getMessage()),HttpStatus.BAD_REQUEST);
        } catch (FileNotFoundException e) {
            return new ResponseEntity(new FileNotFoundException(e.getMessage()),HttpStatus.BAD_REQUEST);
        }

        order.setCardNumber("");
        order.setCardHolder("");
        order.setCvv("");

        return ResponseEntity.ok().body(order);
    }


}
