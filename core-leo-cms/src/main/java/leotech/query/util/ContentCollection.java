package leotech.query.util;

import leotech.cms.model.common.MediaNode;
import leotech.system.util.RandomCollection;

/**
 * 
 * LineItemList for selection by score
 * 
 * @author trieu
 *
 */
public class ContentCollection extends RandomCollection<MediaNode> {

	public ContentCollection() {
		super();
	}

	public void addLineItem(int score, MediaNode item) {
		super.add(score, item);
	}

}
