package test.persistence.util;

import leotech.system.util.Encryptor;

public class UserPassworkTest {

    public static void main(String[] args) {
	 String orginalPass = Encryptor.passwordHash("cms_admin", "Hellboy@12345");
	 System.out.println(orginalPass);
    }
}
