package ru.mail.order.DAO;


import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import ru.mail.order.DAO.model.Order;

import javax.transaction.Transactional;
import java.util.List;


/**
 * @author Denis Monich
 */

@Transactional
public interface OrderDAO extends CrudRepository<Order, Long> {

    @Query("from Order")
    List<Order> list();
}
