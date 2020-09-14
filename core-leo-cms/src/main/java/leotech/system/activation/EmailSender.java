package leotech.system.activation;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.MimeMessage;

import leotech.cdp.model.activation.EmailMessage;
import leotech.system.config.ActivationChannelConfigs;
import redis.clients.jedis.ShardedJedisPool;
import redis.clients.jedis.exceptions.JedisException;
import rfx.core.configs.RedisConfigs;
import rfx.core.nosql.jedis.RedisCommand;

public class EmailSender {
	
	private static final String EMAIL_CONTENT_TEXT_HTML = "text/html";
	
	protected static final class EmailSenderQueue {

		final public static ShardedJedisPool pubSubQueue = RedisConfigs.load().get("pubSubQueue").getShardedJedisPool();
		static String channel = "leocdp_email_queue";
		
		public static long publishToRedisPubSubQueue(EmailMessage emailMsg) {
			String message = emailMsg.toString();
			long rs = new RedisCommand<Long>(pubSubQueue) {
				@Override
				protected Long build() throws JedisException {
					return jedis.publish(channel, message);
				}
			}.execute();
			return rs;
		}
	}
	

	// ------ BEGIN public API Email Service ------
	
	public static void sendToSmtpServer(EmailMessage messageModel) {
		flushEmailToSmtpServer(messageModel);
	}
	
	public static void pushToEmailQueue(EmailMessage messageModel) {
		EmailSenderQueue.publishToRedisPubSubQueue(messageModel);
	}
	
	// ------ END public API Email Service ------
	
	protected static int flushEmailToSmtpServer(EmailMessage messageModel) {
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

	protected static Message buildMessage(EmailMessage messageModel, Session session)
			throws MessagingException, AddressException {
		Message message = new MimeMessage(session);
		message.setFrom(messageModel.getParsedSenderEmailAddress());
		message.setRecipient(Message.RecipientType.TO,messageModel.getParsedReceiverEmailAddress());
		message.setSubject(messageModel.getSubject());
		message.setContent(messageModel.getContent(), EMAIL_CONTENT_TEXT_HTML);
		return message;
	}

	protected static Session getSmtpSessionFromSystemEmailService() {
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
