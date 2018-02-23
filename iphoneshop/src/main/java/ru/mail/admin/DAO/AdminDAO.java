package ru.mail.admin.DAO;

import ru.mail.admin.model.Admin;

/**
 * @author Denis Monich
 */
public interface AdminDAO {

    Admin loadUserByUsername(String username);

}
