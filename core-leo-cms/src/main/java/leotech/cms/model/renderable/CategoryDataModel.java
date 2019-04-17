package leotech.cms.model.renderable;

import java.util.List;

import leotech.cms.model.Category;

public class CategoryDataModel extends WebDataModel {

    
    final List<Category> categories;
    
    public CategoryDataModel(String host, String templateFolder, String templateName, String pageTitle, List<Category> categories) {
	super(host, templateFolder, templateName, pageTitle);
	this.categories = categories;
    }
    
    public List<Category> getCategories() {
	return categories;
    }
    
    //TODO
}
