package pg.eti.kiohub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.*;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.*;



@SpringBootApplication// = @Configuration, @ComponentScan, @EnableAutoConfiguration
//@Configuration
//@ComponentScan(basePackages = {
//    "pg.eti.kiohub.controller",
//    "pg.eti.kiohub.entity",
//    "pg.eti.kiohub.repository",
//    "pg.eti.kiohub.service"
//})
public class KiohubApplication extends SpringBootServletInitializer{

	public static void main(String[] args) {
		SpringApplication.run(KiohubApplication.class, args);
	}
        
        @Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(KiohubApplication.class);
	}                
}
