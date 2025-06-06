
package net.javanc.JavaNC_BookWorld.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dzgtrzmno",
                "api_key", "799794661579635",
                "api_secret", "gr88l9NCrVSUaonk4lgsr8vO61k"
        ));
    }
}