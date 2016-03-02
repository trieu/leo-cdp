package adsplay.service;

import com.sendgrid.SendGrid;
import com.sendgrid.SendGridException;

/**
 * Created by duhc on 02/03/2016.
 */
public class EmailService {

    public static void main(String[] args) throws SendGridException {
        SendGrid sendgrid = new SendGrid("sendgrid_username", "sendgrid_password");

        SendGrid.Email email = new SendGrid.Email();
        email.addTo("example@example.com");
        email.addToName("Example Guy");
        email.setFrom("other@example.com");
        email.setSubject("Hello World");
        email.setText("My first email through SendGrid");

        sendgrid.send(email);
    }

}
