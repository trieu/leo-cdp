package leotech.cms.model;

public class ContentClassPostQuery {

	String key;
	String contentClass;
	String categoryKey;

	int startIndex = 0;
	int limit = 10;

	public ContentClassPostQuery(String key, String contentClass, String categoryKey) {
		super();
		this.key = key;
		this.contentClass = contentClass;
		this.categoryKey = categoryKey;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getContentClass() {
		return contentClass;
	}

	public void setContentClass(String contentClass) {
		this.contentClass = contentClass;
	}

	public String getCategoryKey() {
		return categoryKey;
	}

	public void setCategoryKey(String categoryKey) {
		this.categoryKey = categoryKey;
	}

	public int getStartIndex() {
		return startIndex;
	}

	public void setStartIndex(int startIndex) {
		this.startIndex = startIndex;
	}

	public int getLimit() {
		return limit;
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}

}
