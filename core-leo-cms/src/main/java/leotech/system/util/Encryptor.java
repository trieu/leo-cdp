package leotech.system.util;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;

import rfx.core.util.HashUtil;

public class Encryptor {

    static final String KEY = "Bar12345Bar12345"; // 128 bit key
    static final String INIT_VECTOR = "RandomInitVector"; // 16 bytes IV

    public static String encrypt(String key, String initVector, String value) {
	try {
	    IvParameterSpec iv = new IvParameterSpec(initVector.getBytes("UTF-8"));
	    SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");

	    Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
	    cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);

	    byte[] encrypted = cipher.doFinal(value.getBytes());
	    System.out.println("encrypted string: " + Base64.encodeBase64String(encrypted));

	    return Base64.encodeBase64String(encrypted);
	} catch (Exception ex) {
	    ex.printStackTrace();
	}

	return "";
    }

    public static String decrypt(String key, String initVector, String encrypted) {
	try {
	    IvParameterSpec iv = new IvParameterSpec(initVector.getBytes("UTF-8"));
	    SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");

	    Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
	    cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);

	    byte[] original = cipher.doFinal(Base64.decodeBase64(encrypted));

	    return new String(original);
	} catch (Exception ex) {
	    ex.printStackTrace();
	}

	return "";
    }

    public static String encrypt(String value) {
	return encrypt(KEY, INIT_VECTOR, value);
    }

    public static String decrypt(String value) {
	return decrypt(KEY, INIT_VECTOR, value);
    }
    
    public static String passwordHash(String userLogin , String userPass) {
	return HashUtil.sha1(userLogin + userPass + KEY);
    }

    public static void main(String[] args) {
	String key = "Bar12345Bar12345"; // 128 bit key
	String initVector = "RandomInitVector"; // 16 bytes IV

	String encrypt = encrypt(key, initVector, "Hello World");
	System.out.println(encrypt);
	System.out.println(decrypt(key, initVector, encrypt));
    }
}
