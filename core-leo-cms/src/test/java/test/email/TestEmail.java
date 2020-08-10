package test.email;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import leotech.cdp.model.marketing.EmailMessage;

import java.util.Properties;

public class TestEmail {

	public static void main(String[] args) {

		//sendEmail();
		
		String subject = "Test mail";
		String content = "<html> <head></head> <body> Hello </body></html>";
		EmailMessage message = new EmailMessage("contact@uspa.tech", "tantrieuf31@gmail.com", "Trieu", "ab212dsd", subject, content);
		System.out.println(message);

	}

	public static void sendEmail(EmailMessage messageModel) {
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
			message.setFrom(new InternetAddress(messageModel.getFromEmailAddress()));
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(messageModel.getToEmailAddress()));
			message.setSubject(messageModel.getSubject());
			message.setContent(messageModel.getContent(), "text/html");

			Transport.send(message);

			System.out.println("Done");

		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}
}
