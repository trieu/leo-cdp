package test.email;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

public class TestEmail {

	public static void main(String[] args) {

		final String username = "tantrieuf31.database@gmail.com";
		final String password = "Fx1gGWfL87wVEA3m";

		Properties prop = new Properties();
		prop.put("mail.smtp.host", "smtp-relay.sendinblue.com");
		prop.put("mail.smtp.port", "587");
		prop.put("mail.smtp.auth", "true");
		prop.put("mail.smtp.starttls.enable", "true"); // TLS

		Session session = Session.getInstance(prop, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		});

		try {

			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress("contact@uspa.tech"));
			message.setRecipients(Message.RecipientType.TO,
					InternetAddress.parse("tantrieuf31.database@gmail.com"));
			message.setSubject("Testing Email Marketing");
			message.setText("Dear Mail Crawler," + "\n\n Please do not spam my email!");

			Transport.send(message);

			System.out.println("Done");

		} catch (MessagingException e) {
			e.printStackTrace();
		}

	}
}
