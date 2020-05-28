package test.persistence.bluescope;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import com.google.common.collect.ImmutableMap;

import leotech.cms.dao.CategoryDaoUtil;
import leotech.cms.dao.PageDaoUtil;
import leotech.cms.dao.UserDaoUtil;
import leotech.cms.model.Category;
import leotech.cms.model.Page;
import leotech.system.model.AppMetadata;
import leotech.system.model.User;
import rfx.core.util.Utils;

public class RunSetupCoreDatabase {

    static long networkId = AppMetadata.DEFAULT_ID;
    static String ownerId = "7038807";

    public static void main(String[] args) {
	setupCategoryData();
	setupUserCollection();
	Utils.exitSystemAfterTimeout(1000);
    }
    
    static void setupUserCollection() {
	User user = new User("superadmin", "AppCms4bluescope", "SuperAdmin", "trieunt@blueseed.tv",  AppMetadata.DEFAULT_ID);
	String userId = UserDaoUtil.createNew(user);
	boolean ok = UserDaoUtil.activateAsSuperAdmin(user.getUserLogin());
	System.out.println(ok +" UserDaoUtil.save " + userId);
	
	User user2 = new User("admin", "Admin#bluescope", "Admin", "hont@blueseed.tv",  AppMetadata.DEFAULT_ID);
	String userId2 = UserDaoUtil.createNew(user2);
	boolean ok2 = UserDaoUtil.activateAsSuperAdmin(user2.getUserLogin());
	System.out.println(ok2 + " UserDaoUtil.save " + userId2);
    }

    static void setupCategoryData() {
	Category cate;
	List<String> catList = Arrays.asList("MARKET", "COMPANY", "PRODUCT", "FINISHED_PROJECT", "CUSTOMER_SERVICE", "DOCUMENT");
	Map<String, String> catDisplay = ImmutableMap.<String, String>builder().put("MARKET", "THỊ TRƯỜNG").put("COMPANY", "CÔNG TY").put("PRODUCT", "SẢN PHẨM")
		.put("FINISHED_PROJECT", "CÔNG TRÌNH ĐÃ THỰC HIỆN").put("CUSTOMER_SERVICE", "DỊCH VỤ HẬU MÃI").put("DOCUMENT", "TÀI LIỆU THAM KHẢO").build();

	int i = 1;
	for (String catKeyword : catList) {
	    String catName = catDisplay.get(catKeyword);
	    cate = new Category(catName, networkId);
	    cate.setNavigationOrder(i++);
	    cate.setSlug(catKeyword);
	    boolean ok = CategoryDaoUtil.save(cate) != null;
	    if (ok) {
		setupPageData(catKeyword, cate.getKey());
	    }
	    System.out.println("CategoryDaoUtil.save " + cate.getName() + " key " + cate.getKey());
	}
    }

    static void setupPageData(String catKeyword, String categoryKey) {

	if ("MARKET".equals(catKeyword)) {
	    PageDaoUtil.save(new Page("DOANH NGHIỆP", networkId, categoryKey, ownerId));
	    PageDaoUtil.save(new Page("THỊ TRƯỜNG THÉP", networkId, categoryKey, ownerId));
	} else if ("COMPANY".equals(catKeyword)) {
	    PageDaoUtil.save(new Page("GIỚI THIỆU CÔNG TY", networkId, categoryKey, ownerId));
	    PageDaoUtil.save(new Page("THƯƠNG HIỆU", networkId, categoryKey, ownerId));
	    PageDaoUtil.save(new Page("TRÁCH NHIỆM XÃ HỘI", networkId, categoryKey, ownerId));	    
	} else if ("PRODUCT".equals(catKeyword)) {
	    PageDaoUtil.save(new Page("Coated", networkId, categoryKey, ownerId));
	    PageDaoUtil.save(new Page("Lysaght", networkId, categoryKey, ownerId));
	    PageDaoUtil.save(new Page("Retail", networkId, categoryKey, ownerId));
	} else if ("FINISHED_PROJECT".equals(catKeyword)) {	    // Query Filter Page
	    PageDaoUtil.save(new Page("Các dự án thuộc Lysaght", networkId, categoryKey, ownerId));
	    PageDaoUtil.save(new Page("Các dự án thuộc Coated", networkId, categoryKey, ownerId));
	    PageDaoUtil.save(new Page("Các dự án thuộc Retail", networkId, categoryKey, ownerId));
	} else if ("CUSTOMER_SERVICE".equals(catKeyword)) {
	    // Query Filter Page
	    PageDaoUtil.save(new Page("An toàn", networkId, categoryKey, ownerId));
	    PageDaoUtil.save(new Page("Bảo hành", networkId, categoryKey, ownerId));
	    PageDaoUtil.save(new Page("Chính sách giao hàng", networkId, categoryKey, ownerId));
	    PageDaoUtil.save(new Page("Khuyến mãi", networkId, categoryKey, ownerId));
	} else if ("DOCUMENT".equals(catKeyword)) {
	    PageDaoUtil.save(new Page("Tài liệu Đào tạo", networkId, categoryKey, ownerId));
	    PageDaoUtil.save(new Page("Mẫu đơn", networkId, categoryKey, ownerId));
	    PageDaoUtil.save(new Page("Case study", networkId, categoryKey, ownerId));
	    PageDaoUtil.save(new Page("FAQ", networkId, categoryKey, ownerId));
	}
    }

    static void setupPostData(String cateName, String categoryKey) {

    }
}
