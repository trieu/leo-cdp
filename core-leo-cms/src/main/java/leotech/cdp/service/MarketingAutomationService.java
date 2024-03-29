package leotech.cdp.service;

import java.io.IOException;
import java.math.BigDecimal;

import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;

import io.rocketbase.mail.EmailTemplateBuilder;
import io.rocketbase.mail.EmailTemplateBuilder.EmailTemplateConfigBuilder;
import io.rocketbase.mail.config.TbConfiguration;
import io.rocketbase.mail.config.config.TbBodyConfig;
import io.rocketbase.mail.config.config.TbBodyConfig.TbBodyBorder;
import io.rocketbase.mail.config.config.TbBodyConfig.TbBodyDark;
import io.rocketbase.mail.config.config.TbBoxConfig;
import io.rocketbase.mail.config.config.TbBoxConfig.TbBoxDark;
import io.rocketbase.mail.model.HtmlTextEmail;
import leotech.cdp.model.activation.EmailMessage;
import leotech.system.communication.EmailSender;
import leotech.system.communication.PushNotificationSender;
import rfx.core.util.StringUtil;

public class MarketingAutomationService {
	static String logo = "https://demobookshop.leocdp.com/wp-content/uploads/2020/09/bookshop-logo-416x416.png";
	static TbBodyConfig tbBodyConfig = new TbBodyConfig("#F4F4F7", new TbBodyBorder("1px", "#EAEAEC"),
			new TbBodyDark("#f7f7f7", "#292828"));

	static TbBoxConfig tbBoxConfig = new TbBoxConfig("24px", "#F4F4F7", "2px dashed #CBCCCF", new TbBoxDark("#F4F4F7"));

	static String getHtmlMailWithProduct(String name, String productName, double price, String productLink)
			throws IOException {
		EmailTemplateConfigBuilder builder = EmailTemplateBuilder.builder();

		TbConfiguration config = TbConfiguration.newInstance();
		config.getContent().setFull(true);

		config.setBody(tbBodyConfig);
		config.setBox(tbBoxConfig);
		config.getHeader().setColor("#1100fa");
		config.getTable().getItem().setColor("#1100fa");
		config.getFooter().setColor("#1100fa");

		BigDecimal priceFormated = new BigDecimal(price);
		priceFormated = priceFormated.setScale(2, BigDecimal.ROUND_HALF_EVEN);

		HtmlTextEmail htmlTextEmail = builder.configuration(config).header().logo(logo).logoHeight(120)
				.text("Bookshop ").and().text("Hi " + name + ",").and().text("You may like this book ").and()
				.tableSimple("").headerRow("Description", "Amount").itemRow(productName, priceFormated).and()
				.button("Product View", productLink).green().right().and().copyright("USPA").url("https://uspa.tech")
				.suffix(". All rights reserved.").and().footerText("This is a demo email from Leo CDP").and()
				// .footerImage(TESTONEPIXEL_PNG).width(1)
				.build();
		String html = htmlTextEmail.getHtml();
		return html;
	}

	static String getThanksEmail(String name) throws IOException {
		EmailTemplateConfigBuilder builder = EmailTemplateBuilder.builder();

		TbConfiguration config = TbConfiguration.newInstance();
		config.getContent().setFull(true);

		config.setBody(tbBodyConfig);
		config.setBox(tbBoxConfig);
		config.getHeader().setColor("#1100fa");
		config.getTable().getItem().setColor("#1100fa");
		config.getFooter().setColor("#1100fa");

		HtmlTextEmail htmlTextEmail = builder.configuration(config).header().logo(logo).logoHeight(120)
				.text("Email Confirmation ").and().text("Hi " + name + ",").and().text("Thanks for your information ")
				.and()

				.copyright("USPA").url("https://uspa.tech").suffix(". All rights reserved.").and()
				.footerText("This is a demo email from Leo CDP").and()
				// .footerImage(TESTONEPIXEL_PNG).width(1)
				.build();
		String html = htmlTextEmail.getHtml();
		return html;
	}

	public static void sendThanksEmail(String profileId, String toEmailAddress, String name) {
		try {
			String content = MarketingAutomationService.getThanksEmail(name);
			EmailMessage messageModel = new EmailMessage("contact@uspa.tech", toEmailAddress, name, profileId,
					"Thanks for your information", content);
			EmailSender.sendToSmtpServer(messageModel);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public static boolean isValidEmailAddress(String email) {
		boolean result = true;
		try {
			InternetAddress emailAddr = new InternetAddress(email);
			emailAddr.validate();
		} catch (AddressException ex) {
			result = false;
		}
		return result;
	}

	public static void sendRecommendation(String profileId, String oneSignalPlayerId , String toEmailAddress, String name, String productName, double price, String productLink) {
		try {
			String heading = "You may like this product ";
			
			if(isValidEmailAddress(toEmailAddress)) {
				String content = MarketingAutomationService.getHtmlMailWithProduct(name, productName, price, productLink);
				EmailMessage messageModel = new EmailMessage("contact@uspa.tech", toEmailAddress, name, profileId, "Product you may like: " + productName, content);
				EmailSender.sendToSmtpServer(messageModel);
			}
			
			if(StringUtil.isNotEmpty(oneSignalPlayerId)) {
				if(oneSignalPlayerId.length() > 5) {
					PushNotificationSender.notifyUser(oneSignalPlayerId, heading, productName, productLink );
				}
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
