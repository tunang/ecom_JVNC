package net.javanc.JavaNC_BookWorld.dto;

public class RegisterWithOtpRequest {
    private RegisterRequest registerRequest;
    private String otp;

    // Getter & Setter
    public RegisterRequest getRegisterRequest() {
        return registerRequest;
    }
    public void setRegisterRequest(RegisterRequest registerRequest) {
        this.registerRequest = registerRequest;
    }
    public String getOtp() {
        return otp;
    }
    public void setOtp(String otp) {
        this.otp = otp;
    }
}
