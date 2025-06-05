package net.javanc.JavaNC_BookWorld.dto;

public class PayOSWebhookRequest {
    private Long orderCode;
    private String status;
    private String signature;
    private PayOSWebhookData data;

    public Long getOrderCode() {
        return orderCode;
    }

    public void setOrderCode(Long orderCode) {
        this.orderCode = orderCode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public PayOSWebhookData getData() {
        return data;
    }

    public void setData(PayOSWebhookData data) {
        this.data = data;
    }
}
