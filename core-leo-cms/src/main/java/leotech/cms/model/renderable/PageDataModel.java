package leotech.cms.model.renderable;

import java.util.Arrays;
import java.util.List;

import leotech.cms.model.Page;

public class PageDataModel extends WebData {

	private final List<Page> pages;

	public PageDataModel(String host, String templateFolder, String templateName, String pageTitle,
			List<Page> pages) {
		super(host, templateFolder, templateName, pageTitle);
		this.pages = pages;
	}

	public PageDataModel(String host, String templateFolder, String templateName, String pageTitle, Page page) {
		super(host, templateFolder, templateName, pageTitle);
		this.pages = Arrays.asList(page);
	}

	public List<Page> getPages() {
		return pages;
	}
}
