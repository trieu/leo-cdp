package leotech.cms.model.bot;

import java.util.ArrayList;
import java.util.List;

import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.google.gson.annotations.Expose;

public abstract class ContentBot {

    @DocumentField(Type.KEY)
    @Expose
    protected String key;

    @Expose
    protected String name = "";
    
    @Expose
    String creatorId = "";

    @Expose
    protected List<String> subscribedPageIds = new ArrayList<>();// automation search content for page

    @Expose
    protected List<String> subscribedPostIds = new ArrayList<>();// automation search related content for post

    @Expose
    protected List<String> subscribedUserIds = new ArrayList<>();// automation search related user for user
    
    public ContentBot() {
    }
    
    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }

    public List<String> getSubscribedPageIds() {
        return subscribedPageIds;
    }

    public void setSubscribedPageIds(List<String> subscribedPageIds) {
        this.subscribedPageIds = subscribedPageIds;
    }

    public List<String> getSubscribedPostIds() {
        return subscribedPostIds;
    }

    public void setSubscribedPostIds(List<String> subscribedPostIds) {
        this.subscribedPostIds = subscribedPostIds;
    }

    public List<String> getSubscribedUserIds() {
        return subscribedUserIds;
    }

    public void setSubscribedUserIds(List<String> subscribedUserIds) {
        this.subscribedUserIds = subscribedUserIds;
    }
    
    abstract public void process();
}
