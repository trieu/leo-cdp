package leotech.cms.model;

public class ContentClassPostQuery {
    
    String contentClass;
    String categoryKey;
    
    int startIndex;
    int limit;
    
    
    
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
