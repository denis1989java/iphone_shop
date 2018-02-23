package ru.mail.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.log4j.Logger;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import ru.mail.security.model.SecurityResponseEntity;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


/**
 * @author Denis Monich
 * access denied handler, sending response to UI with code 200 and message: access denied
 */
@Component("restServicesEntryPoint")
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private static final Logger logger = Logger.getLogger(RestAuthenticationEntryPoint.class);

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException e) throws IOException, ServletException {

        logger.debug("access denied entry point");

        SecurityResponseEntity securityResponseEntity = new SecurityResponseEntity();
        securityResponseEntity.setMessage("access denied");

        response.getWriter().write(new ObjectMapper().writeValueAsString(securityResponseEntity));
        response.setStatus(200);

    }

}
