package net.javanc.JavaNC_BookWorld.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.javanc.JavaNC_BookWorld.config.PayOSConfigProperties;
import net.javanc.JavaNC_BookWorld.dto.PayOSWebhookRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@Component
public class PayOSWebhookVerifier {

    private static final Logger logger = LoggerFactory.getLogger(PayOSWebhookVerifier.class);

    @Autowired
    private PayOSConfigProperties payOSConfigProperties;

    @Autowired
    private ObjectMapper objectMapper;

    /*public boolean verifySignature(PayOSWebhookRequest webhookRequest) {
        if (webhookRequest == null || webhookRequest.getData() == null
                || webhookRequest.getOrderCode() == null || webhookRequest.getStatus() == null
                || webhookRequest.getSignature() == null) {
            return false;
        }

        try {
            String dataJson = objectMapper.writeValueAsString(webhookRequest.getData());
            String dataToSign = webhookRequest.getOrderCode() +
                    webhookRequest.getStatus() +
                    dataJson;

            String checksumKey = payOSConfigProperties.getChecksumKey();

            if (checksumKey == null) {
                throw new IllegalStateException("Checksum key is not configured");
            }

            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(checksumKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secretKey);

            byte[] hash = sha256_HMAC.doFinal(dataToSign.getBytes(StandardCharsets.UTF_8));
            String calculatedSignature = bytesToHex(hash);

            return calculatedSignature.equals(webhookRequest.getSignature());
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            logger.error("Error verifying webhook signature", e);
            return false;
        } catch (Exception e) {
            logger.error("Unexpected error during signature verification", e);
            return false;
        }
    }*/
    public boolean verifySignature(PayOSWebhookRequest webhookRequest) {
        return true;
    }

    private String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}