package net.javanc.JavaNC_BookWorld.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "payos")
public class PayOSConfigProperties {
    private String clientId;
    private String apiKey;
    private String checksumKey;

    // Getters & Setters
    public String getClientId() {
        return clientId;
    }
    public void setClientId(String clientId) {
        this.clientId = clientId;
    }
    public String getApiKey() {
        return apiKey;
    }
    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
    public String getChecksumKey() {
        return checksumKey;
    }
    public void setChecksumKey(String checksumKey) {
        this.checksumKey = checksumKey;
    }
}
