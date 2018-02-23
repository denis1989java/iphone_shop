import com.fasterxml.jackson.databind.ObjectMapper;
import javafx.application.Application;
import org.apache.log4j.Logger;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;

import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import ru.mail.SpringBootWebApplication;
import ru.mail.controller.WebController;
import ru.mail.order.DAO.model.Order;
import ru.mail.phone.DAO.model.Phone;


import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = SpringBootWebApplication.class)
@ActiveProfiles("test")
public class MockTest {

    private static final Logger logger = Logger.getLogger(WebController.class);


    @Autowired
    WebApplicationContext context;
    @Autowired
    ObjectMapper objectMapper;

    private MockMvc mvc;

    @Before
    public void initTests() {
        MockitoAnnotations.initMocks(this);
        mvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    /**
     * gettting all phones  - we have only 3 phones
     */
    @Test
    public void getPhones() throws Exception {

        logger.debug("getting all phones in \"getPhones\" test");

        mvc.perform(get("/api/v1/phones")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.phones", hasSize(3)));
    }


    /**
     * creating and saving new order - getting it back with id!=null
     */
    @Test
    public void createOrder() throws  Exception{

        logger.debug("creating order in \"createOrder\" test");

        Order order=new Order();
        order.setEmail("denis1989@bk.ru");
        order.setCardNumber("8888999966665555");
        order.setCardHolder("Denis Monich");
        order.setAdminCardNumber("8888");
        order.setCvv("111");
        order.setCurrency("CHF");

        logger.debug("creating phone in \"createOrder\" test");

        Phone phone=new Phone();
        phone.setId(2L);
        order.setPhone(phone);

        logger.debug("getting new order with id in \"createOrder\" test");

        mvc.perform(post("/api/v1/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(order)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber());
    }
}
