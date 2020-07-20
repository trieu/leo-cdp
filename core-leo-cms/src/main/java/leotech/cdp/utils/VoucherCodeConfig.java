package leotech.cdp.utils;

import java.util.Arrays;

public class VoucherCodeConfig {
public final static char PATTERN_PLACEHOLDER = '#';
    
    public static class Charset {
        public static final String ALPHABETIC   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        public static final String ALPHANUMERIC = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        public static final String NUMBERS      = "0123456789";
    }
    
    private final int length;
    private final String charset;
    private final String prefix;
    private final String postfix;
    private final String pattern;
      
    public VoucherCodeConfig(Integer length, String charset, String prefix, String postfix, String pattern) {
        if (length == null) {
            length = 8;
        }
        
        if (charset == null) {
            charset = Charset.ALPHANUMERIC;
        }
        
        if (pattern == null) {
            char[] chars = new char[length];
            Arrays.fill(chars, PATTERN_PLACEHOLDER);
            pattern = new String(chars);
        }
        
        this.length = length;
        this.charset = charset;
        this.prefix = prefix;
        this.postfix = postfix;
        this.pattern = pattern;        
    }
    
    public static VoucherCodeConfig length(int length) {
        return new VoucherCodeConfig(length, null, null, null, null);
    }
    
    public static VoucherCodeConfig pattern(String pattern) {
        return new VoucherCodeConfig(null, null, null, null, pattern);
    }

    public int getLength() {
        return length;
    }

    public String getCharset() {
        return charset;
    }
    
    public VoucherCodeConfig withCharset(String charset) {
        return new VoucherCodeConfig(length, charset, prefix, postfix, pattern);
    }

    public String getPrefix() {
        return prefix;
    }
    
    public VoucherCodeConfig withPrefix(String prefix) {
        return new VoucherCodeConfig(length, charset, prefix, postfix, pattern);
    }

    public String getPostfix() {
        return postfix;
    }
    
    public VoucherCodeConfig withPostfix(String postfix) {
        return new VoucherCodeConfig(length, charset, prefix, postfix, pattern);
    }

    public String getPattern() {
        return pattern;
    }
    
    @Override
    public String toString() {
        return "VoucherCodeConfig ["
                + "length="  + length  + ", "
                + "charset=" + charset + ", "
                + "prefix="  + prefix  + ", "
                + "postfix=" + postfix + ", "
                + "pattern=" + pattern + "]";
    }
}
