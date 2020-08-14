package test.email;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;

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
import leotech.system.util.email.EmailSender;
import rfx.core.util.FileUtils;
import rfx.core.util.Utils;

public class EmailTemplateTest {
	
	private static final String TESTONEPIXEL_PNG = "https://bit.ly/testonepixel-png?cb=1234&type=.png";
	static String logo = "https://bit.ly/30GfCzf?type=.png";
	static TbBodyConfig tbBodyConfig = new TbBodyConfig("#F4F4F7",
            new TbBodyBorder("1px", "#EAEAEC"),
            new TbBodyDark("#f7f7f7", "#292828"));
	
	 static  TbBoxConfig tbBoxConfig = new TbBoxConfig("24px",
	            "#F4F4F7",
	            "2px dashed #CBCCCF",
	            new TbBoxDark("#F4F4F7"));

	public static void main(String[] args) throws IOException {
		String content = getHtmlMailWithProduct();
		File file = new File("/Users/mac/projects/leo-cms-framework/core-leo-cms/BUILD-OUTPUT/testemail.html");
		file.createNewFile();
		FileUtils.writeStringToFile(file.getAbsolutePath(),content);
		EmailMessage messageModel = new EmailMessage("support@leocdp.com", "tantrieuf31.database@gmail.com", "Trieu", "121", "Leo CDP test", content);
		EmailSender.sendToSendGridServer(messageModel, true);
		Utils.sleep(3000);
//		EmailSender.flushMessageQueue();
//		
//		Utils.sleep(10000);
	}
	
	static String getHtmlMailWithProduct() throws IOException {
		EmailTemplateConfigBuilder builder = EmailTemplateBuilder.builder();
		
		TbConfiguration config = TbConfiguration.newInstance();
		config.getContent().setFull(true);
		
		config.setBody(tbBodyConfig);
		config.setBox(tbBoxConfig);
		config.getHeader().setColor("#1100fa");
		config.getTable().getItem().setColor("#1100fa");
		config.getFooter().setColor("#1100fa");

		String name = "Trieu";
		HtmlTextEmail htmlTextEmail = builder
		        .configuration(config)
		        .header().logo(logo).logoHeight(120).text("Leo CDP ").and()
		        .text("Hi "+name  +",").and()
		        .text("Thanks for using Leo CDP. This is an invoice for your recent purchase").and()
		        .tableSimple("#.## 'USD'")
		        .headerRow("Description", "Amount")
		        .itemRow("Special Product Some extra explanations in separate line", BigDecimal.valueOf(1333, 2))
		        .itemRow("Short service", BigDecimal.valueOf(103, 1))
		        .footerRow("Total", BigDecimal.valueOf(2363, 2))
		        .and()
		        .button("Download", "https://bigdatavietnam.org").gray().right().and()
		        .text("If you have any questions about this receipt, simply reply to this email or reach out to our support team for help.").and()
		        .copyright("USPA").url("https://uspa.tech").suffix(". All rights reserved.").and()
		        .footerText("[Company Name, LLC] 1234 Street Rd. Suite 1234").and()
		        .footerImage(TESTONEPIXEL_PNG).width(1)
		        .build();
		String html = htmlTextEmail.getHtml();
		return html;
	}

	private static String getHtmlEmail() throws IOException {
		EmailTemplateConfigBuilder builder = EmailTemplateBuilder.builder();
		
		TbConfiguration config = TbConfiguration.newInstance();
		config.getContent().setFull(true);
		
		config.setBody(tbBodyConfig);
		config.setBox(tbBoxConfig);
//		config.getHeader().setColor("#1100fa");
//		config.getTable().getItem().setColor("#1100fa");
//		config.getFooter().setColor("#1100fa");
		
		
		HtmlTextEmail htmlTextEmail = builder
				.configuration(config)
		        .header()
		        .logo("https://www.rocketbase.io/img/logo-dark.png").logoHeight(41)
		        .and()
		        .text("Welcome, {{name}}!").h1().center().and()
		        .text("Thanks for trying [Product Name]. We’re thrilled to have you on board. To get the most out of [Product Name], do this primary next step:").and()
		        .button("Do this Next", "http://localhost").blue().and()
		        .text("For reference, here's your login information:").and()
		        .attribute()
		        .keyValue("Login Page", "{{login_url}}")
		        .keyValue("Username", "{{username}}")
		        .and()
		        .html("If you have any questions, feel free to <a href=\"mailto:{{support_email}}\">email our customer success team</a>. (We're lightning quick at replying.) We also offer <a href=\"{{live_chat_url}}\">live chat</a> during business hours.",
		                "If you have any questions, feel free to email our customer success team\n" +
		                        "(We're lightning quick at replying.) We also offer live chat during business hours.").and()
		        .text("Cheers,\n" +
		                "The [Product Name] Team").and()
		        .copyright("rocketbase").url("https://www.rocketbase.io").suffix(". All rights reserved.").and()
		        .footerText("[Company Name, LLC]\n" +
		                "1234 Street Rd.\n" +
		                "Suite 1234").and()
		        .footerImage("https://cdn.rocketbase.io/assets/loading/no-image.jpg").width(100).linkUrl("https://www.rocketbase.io").and()
		        .build();
		String html = htmlTextEmail.getHtml();
		return html;
	}
}
