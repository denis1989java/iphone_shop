package ru.mail.order.DAO.model;

import ru.mail.phone.DAO.model.Phone;

import javax.persistence.*;
import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.math.BigDecimal;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(name = "email")
    private String email;
    @Column(name = "card_number")
    private String cardNumber;
    @Column(name = "admin_card_number")
    private String adminCardNumber;
    @Column(name = "card_holder")
    private String cardHolder;
    @Column(name = "cvv")
    private String cvv;
    @Column(name = "currency")
    private String currency;
    @Column(name = "price_usd")
    private BigDecimal priceUSD;
    @Column(name = "price_user_currency")
    private BigDecimal priceUserCurrency;
    @OneToOne
    @JoinColumn(name = "phone_id")
    private Phone phone;

    public Order() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getAdminCardNumber() {
        return adminCardNumber;
    }

    public void setAdminCardNumber(String adminCardNumber) {
        this.adminCardNumber = adminCardNumber;
    }

    public String getCardHolder() {
        return cardHolder;
    }

    public void setCardHolder(String cardHolder) {
        this.cardHolder = cardHolder;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getPriceUSD() {
        return priceUSD;
    }

    public void setPriceUSD(BigDecimal priceUSD) {
        this.priceUSD = priceUSD;
    }

    public BigDecimal getPriceUserCurrency() {
        return priceUserCurrency;
    }

    public void setPriceUserCurrency(BigDecimal priceUserCurrency) {
        this.priceUserCurrency = priceUserCurrency;
    }

    public Phone getPhone() {
        return phone;
    }

    public void setPhone(Phone phone) {
        this.phone = phone;
    }

    @Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", cardNumber='" + cardNumber + '\'' +
                ", adminCardNumber='" + adminCardNumber + '\'' +
                ", cardHolder='" + cardHolder + '\'' +
                ", cvv='" + cvv + '\'' +
                ", currency='" + currency + '\'' +
                ", priceUSD=" + priceUSD +
                ", priceUserCurrency=" + priceUserCurrency +
                ", phone=" + phone +
                '}';
    }
}
