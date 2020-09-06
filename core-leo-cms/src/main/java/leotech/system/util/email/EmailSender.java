package leotech.system.util.email;

import java.util.Properties;
import java.util.Queue;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ArrayBlockingQueue;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.MimeMessage;

import leotech.cdp.model.activation.EmailMessage;
import leotech.system.config.ActivationChannelConfigs;

public class EmailSender {
	
	private static final String EMAIL_CONTENT_TEXT_HTML = "text/html";
	public static final int MAX_SIZE_QUEUE = 100000;
	static Queue<EmailMessage> queueEmailMessage = new ArrayBlockingQueue<EmailMessage>(MAX_SIZE_QUEUE);
	static Timer timer = new Timer(true);

	// ------ BEGIN SMTP Server ------
	public static void sendToSmtpServer(EmailMessage messageModel) {
		sendToSmtpServer(messageModel, false);
	}
	
	public static void sendToSmtpServer(EmailMessage messageModel, boolean flushNow) {
		if(flushNow) {
			flushEmailToSmtpServer(messageModel);
		} else {
			queueEmailMessage.add(messageModel);
		}
		
		System.out.println(messageModel);
		System.out.println(queueEmailMessage.size());
	}
	
	static int flushEmailToSmtpServer(EmailMessage messageModel) {
		try {
			Session session = getSmtpSessionFromSystemEmailService();
			Message message = buildMessage(messageModel, session);
			Transport.send(message);
			return 1;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return 0;
	}
	
	// ----- END SMTP Server ------
	
	
	// ------ BEGIN SendGrid Service ------
	
	public static void sendToSendGridServer(EmailMessage messageModel) {
		sendToSendGridServer(messageModel, false);
	}
	
	public static void sendToSendGridServer(EmailMessage messageModel, boolean flushNow) {
		if(flushNow) {
			EmailSenderDataService.pushToRedisPubSubQueue(messageModel);
		} else {
			timer.schedule(new TimerTask() {
				@Override
				public void run() {
					EmailSenderDataService.pushToRedisPubSubQueue(messageModel);
				}
			}, 1500);
		}
	}
	
	// ------ END SendGrid Service ------

	
	public static void flushMessageQueue() {
		int c = 0;
		for (int i = 0; i < 10; i++) {
			EmailMessage messageModel = queueEmailMessage.poll();
			if (messageModel == null) {
				System.out.println("messageModel is null");
				break;
			}
			c += flushEmailToSmtpServer(messageModel);
		}
		System.out.println("EmailSender has sent " + c + " messages");
	}


	static Message buildMessage(EmailMessage messageModel, Session session)
			throws MessagingException, AddressException {
		Message message = new MimeMessage(session);
		message.setFrom(messageModel.getParsedSenderEmailAddress());
		message.setRecipient(Message.RecipientType.TO,messageModel.getParsedReceiverEmailAddress());
		message.setSubject(messageModel.getSubject());
		message.setContent(messageModel.getContent(), EMAIL_CONTENT_TEXT_HTML);
		return message;
	}

	private static Session getSmtpSessionFromSystemEmailService() {
		ActivationChannelConfigs configs = ActivationChannelConfigs.loadSystemEmailServiceConfig();
		String username = configs.getValue("smtp_username");
		String password = configs.getValue("smtp_password");

		Properties prop = new Properties();
		prop.put("mail.smtp.host", configs.getValue("smtp_host"));
		prop.put("mail.smtp.port", configs.getValue("smtp_port"));
		prop.put("mail.smtp.auth", configs.getValue("smtp_auth"));
		prop.put("mail.smtp.starttls.enable", configs.getValue("smtp_starttls_enable")); // TLS

		Session session = Session.getInstance(prop, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		});
		return session;
	}
}
