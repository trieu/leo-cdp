package leotech.cdp.model.journey;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;
import com.arangodb.entity.DocumentField;
import com.arangodb.entity.DocumentField.Type;
import com.arangodb.model.FulltextIndexOptions;
import com.arangodb.model.HashIndexOptions;
import com.arangodb.model.PersistentIndexOptions;
import com.google.gson.Gson;
import com.google.gson.annotations.Expose;

import leotech.cdp.model.CdpPersistentObject;
import rfx.core.util.StringUtil;

/**
 * @author Trieu (Thomas)
 * In free version 1.x, we give them only 1 media journey map in database
 *
 */
public class MediaJourneyMap extends CdpPersistentObject {

	public static final String COLLECTION_NAME = getCollectionName(MediaJourneyMap.class);
	static ArangoCollection instance;

	@Override
	public ArangoCollection getDbCollection() {
		if (instance == null) {
			ArangoDatabase arangoDatabase = getDatabaseInstance();

			instance = arangoDatabase.collection(COLLECTION_NAME);

			// ensure indexing key fields for fast lookup
			instance.ensureFulltextIndex(Arrays.asList("name"), new FulltextIndexOptions());
			instance.ensurePersistentIndex(Arrays.asList("refProfileId"), new PersistentIndexOptions().unique(false));
			instance.ensurePersistentIndex(Arrays.asList("isTargetPersona"), new PersistentIndexOptions().unique(false));
		}
		return instance;
	}

	@Override
	public boolean isReadyForSave() {
		return StringUtil.isNotEmpty(this.name) && this.journeyStages.size() > 0 && mediaChannelMap != null;
	}
	
	public static final class Node implements Comparable<Node> {
		int id;
		String name;
		
		public Node() {
			// TODO Auto-generated constructor stub
		}
		
		public Node(int id, String name) {
			super();
			this.id = id;
			this.name = name;
		}
		
		public int getId() {
			return id;
		}
		public void setId(int id) {
			this.id = id;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}

		@Override
		public int compareTo(Node o) {
			if(this.id > o.getId()) {
				return 1;
			}
			else if(this.id < o.getId()) {
				return -1;
			}
			return 0;
		}
		
	}
	
	public static final class LinkNode {
		int source;
		int target;
		long value;
		
		public LinkNode() {}
		
		public LinkNode(int source, int target, long value) {
			super();
			this.source = source;
			this.target = target;
			this.value = value;
		}

		public int getSource() {
			return source;
		}
		public void setSource(int source) {
			this.source = source;
		}
		public int getTarget() {
			return target;
		}
		public void setTarget(int target) {
			this.target = target;
		}
		public long getValue() {
			return value;
		}
		public void setValue(long value) {
			this.value = value;
		}
		
		@Override
		public String toString() {
			return new Gson().toJson(this);
		}
	}
	
	@DocumentField(Type.KEY)
	@Expose
	protected String id;
	
	@Expose
	protected String name;
	
	@Expose
	boolean isTargetPersona = true; // is the map used for persona profile or real person profile
	
	@Expose
	protected String refProfileId = "";// targeted profile ID with type = Persona

	@Expose
	protected String defaultMetricName = "Visit";// default metric name for all journey stages
	
	@Expose
	protected List<String> journeyStages = new ArrayList<String>(); // list of ordered nodes for journey map visualization in JS
	
	@Expose
	protected Map<String,String> journeyStageMetrics = new HashMap<>(); // map of journey name => metric name
	
	@Expose
	protected List<Node> journeyNodes = new ArrayList<MediaJourneyMap.Node>(); // list of ordered nodes for journey map visualization in JS 
	
	@Expose
	protected List<LinkNode> journeyLinks = new ArrayList<MediaJourneyMap.LinkNode>(); // list of node connections for journey map visualization in JS 
	
	@Expose
	protected Map<String,MediaChannel> mediaChannelMap;
	
	@Expose
	protected Map<String,Integer> mediaChannelIndex; // list of ordered nodes for data persistence with reversed indexing
	
	public MediaJourneyMap() {
		
	}

	public MediaJourneyMap(Map<String,MediaChannel> mediaChannelMap, Map<String,Integer> mediaChannelIndex, Map<String,String> journeyStageMetrics) {
		super();
		this.mediaChannelMap = mediaChannelMap;
		this.mediaChannelIndex = mediaChannelIndex;
		this.journeyStageMetrics = journeyStageMetrics;
		
		Set<String> mediaNames = mediaChannelMap.keySet();
		for (String mediaName : mediaNames) {
			int index = mediaChannelIndex.get(mediaName);
			journeyStages.add(mediaName);
			journeyNodes.add(new Node(index, mediaName));
		}
		Collections.sort(journeyNodes);
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDefaultMetricName() {
		return defaultMetricName;
	}

	public void setDefaultMetricName(String defaultMetricName) {
		this.defaultMetricName = defaultMetricName;
	}

	public List<String> getJourneyStages() {
		return journeyStages;
	}

	public void setJourneyStages(List<String> journeyStages) {
		this.journeyStages = journeyStages;
	}

	public Map<String, String> getJourneyStageMetrics() {
		return journeyStageMetrics;
	}

	public void setJourneyStageMetrics(Map<String, String> journeyStageMetrics) {
		this.journeyStageMetrics = journeyStageMetrics;
	}

	public String getRefProfileId() {
		return refProfileId;
	}

	public void setRefProfileId(String refProfileId) {
		this.refProfileId = refProfileId;
	}

	public List<LinkNode> getJourneyLinks() {
		return journeyLinks;
	}

	public void setJourneyLinks(List<LinkNode> journeyLinks) {
		this.journeyLinks = journeyLinks;
	}
	
	public void addJourneyLink(MediaChannel mediaSource, MediaChannel mediaTarget, long value) {
		int mediaSourceIndex = mediaChannelIndex.getOrDefault(mediaSource.getName(),-1);
		int mediaTargetIndex = mediaChannelIndex.getOrDefault(mediaTarget.getName(),-1);
		if(mediaSourceIndex >=0 && mediaTargetIndex >= 0) {
			this.journeyLinks.add(new LinkNode(mediaSourceIndex, mediaTargetIndex, value));
		}
	}
	
	

	public List<Node> getJourneyNodes() {
		return journeyNodes;
	}

	public void setJourneyNodes(List<Node> journeyNodes) {
		this.journeyNodes = journeyNodes;
	}

	public Map<String, MediaChannel> getMediaChannelMap() {
		return mediaChannelMap;
	}

	public void setMediaChannelMap(Map<String, MediaChannel> mediaChannelMap) {
		this.mediaChannelMap = mediaChannelMap;
	}

	public Map<String, Integer> getMediaChannelIndex() {
		return mediaChannelIndex;
	}

	public void setMediaChannelIndex(Map<String, Integer> mediaChannelIndex) {
		this.mediaChannelIndex = mediaChannelIndex;
	}

	public boolean isTargetPersona() {
		return isTargetPersona;
	}

	public void setTargetPersona(boolean isTargetPersona) {
		this.isTargetPersona = isTargetPersona;
	}
	
	@Override
	public String toString() {
		return new Gson().toJson(this);
	}
	
}
