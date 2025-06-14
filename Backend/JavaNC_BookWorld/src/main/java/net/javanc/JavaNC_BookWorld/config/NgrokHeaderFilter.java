package net.javanc.JavaNC_BookWorld.config;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class NgrokHeaderFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        if (response instanceof HttpServletResponse) {
            HttpServletResponse res = (HttpServletResponse) response;
            res.setHeader("ngrok-skip-browser-warning", "*");
        }

        chain.doFilter(request, response);
    }
}
