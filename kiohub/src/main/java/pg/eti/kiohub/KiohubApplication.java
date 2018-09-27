package pg.eti.kiohub;

import javax.servlet.FilterRegistration;
import javax.servlet.ServletContext;
import org.jasig.cas.client.validation.Cas20ProxyReceivingTicketValidationFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.*;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.*;



@SpringBootApplication
public class KiohubApplication extends SpringBootServletInitializer{

	public static void main(String[] args) {
		SpringApplication.run(KiohubApplication.class, args);
	}
        
        @Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(KiohubApplication.class);
	}        

        @Override
        public void onStartup(ServletContext sc) {
            FilterRegistration.Dynamic authentication = sc.addFilter("CAS Authentication Filter", org.jasig.cas.client.authentication.AuthenticationFilter.class);
            authentication.setInitParameter("casServerLoginUrl", "https://logowanie.pg.gda.pl/login");
            authentication.setInitParameter("serverName", "http://kiohub.eti.pg.gda.pl");
            authentication.addMappingForUrlPatterns(null, false, "/*");
            
            FilterRegistration.Dynamic validation = sc.addFilter("CAS Validation Filter", org.jasig.cas.client.validation.Cas20ProxyReceivingTicketValidationFilter.class);
            validation.setInitParameter("casServerUrlPrefix", "https://logowanie.pg.gda.pl");
            validation.setInitParameter("serverName", "http://kiohub.eti.pg.gda.pl");
            validation.setInitParameter("redirectAfterValidation", "true");
            validation.setInitParameter("useSession", "true");
            validation.setInitParameter("authn_method", "mfa-duo");
            validation.addMappingForUrlPatterns(null, false, "/*");
            
            FilterRegistration.Dynamic wrapper = sc.addFilter("CAS HttpServletRequest Wrapper Filter", org.jasig.cas.client.util.HttpServletRequestWrapperFilter.class);
            wrapper.addMappingForUrlPatterns(null, false, "/*");
        }
}
