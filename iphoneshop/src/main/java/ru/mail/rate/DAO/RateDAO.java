package ru.mail.rate.DAO;

import ru.mail.rate.DAO.model.Rate;

import java.io.FileNotFoundException;

public interface RateDAO {
    Rate getRate() throws FileNotFoundException;
}
