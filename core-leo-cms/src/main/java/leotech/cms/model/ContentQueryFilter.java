package leotech.cms.model;

import java.util.SortedSet;

import com.google.gson.annotations.Expose;

import leotech.cms.model.common.QueryFilter;

public class ContentQueryFilter extends QueryFilter {

    @Expose
    SortedSet<Page> pages;

    @Expose
    SortedSet<Post> posts;

    public ContentQueryFilter(String name, long networkId) {
	super(name, networkId);
    }

}
