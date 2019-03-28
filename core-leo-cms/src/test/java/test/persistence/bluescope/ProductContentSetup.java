package test.persistence.bluescope;

import leotech.cms.dao.PostDaoUtil;
import leotech.cms.model.MediaInfoUnit;
import leotech.cms.model.Post;

public class ProductContentSetup {
    
    public static void main(String[] args) {
	Post p = PostDaoUtil.getById("10000-f272b5cd8db8797581721cb560112e9b02a53c0d");
	System.out.println(p.getTitle());
	String content = "";
	
	content = "Công nghệ bức xạ mặt trời Thermatech® được kết hợp với thép\n" + 
		"                    COLORBOND® để làm giảm nhiệt độ bề mặt bằng cách giảm sự hấp thụ\n" + 
		"                    nhiệt từ mặt trời. Hay nói cách khác, công nghệ Thermatech® có khả\n" + 
		"                    năng phản hồi bức xạ mặt trời của vật liệu tấm lợp. Chỉ số phản xạ\n" + 
		"                    năng lượng mặt trời (SRI) là giá trị biểu hiện khả năng phản xạ bức\n" + 
		"                    xạ mặt trời. Trị số SRI càng cao thể hiện nhiệt độ bề mặt mái công\n" + 
		"                    trình càng thấp.";
	p.setMediaInfoUnit(new MediaInfoUnit("CÔNG NGHỆ THERMATECH®", content));
	
	content = "Công cụ đánh giá công trình xanh theo tiêu chuẩn LEED (Leadership in\n" + 
		"                    Energy and Environment Design) đòi hỏi các vật liệu có trị số SRI\n" + 
		"                    cao để làm giảm hiệu ứng đảo nhiệt đô thị (UHI). Thép COLORBOND® với\n" + 
		"                    công nghệ Thermatech® có khả năng cung cấp những trị số SRI cao, đáp\n" + 
		"                    ứng yêu cầu tiêu chuẩn của công trình xanh*.";
	p.setMediaInfoUnit(new MediaInfoUnit("ĐÁP ỨNG TIÊU CHUẨN LEED", content));
	
	PostDaoUtil.save(p);
    }

}
