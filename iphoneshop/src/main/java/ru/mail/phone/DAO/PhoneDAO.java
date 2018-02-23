package ru.mail.phone.DAO;


import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import ru.mail.phone.DAO.model.Phone;

import javax.transaction.Transactional;
import java.util.List;

/**
 * @author Denis Monich
 */

@Transactional
public interface PhoneDAO extends CrudRepository<Phone, Long> {

    @Query("from Phone")
    List<Phone> list();

}
