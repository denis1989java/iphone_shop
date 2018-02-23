package ru.mail.order.service;

import ru.mail.order.DAO.model.Order;

import java.io.FileNotFoundException;
import java.util.List;

public interface OrderService {
    List<Order> list();
    Order save(Order order) throws FileNotFoundException;
}
