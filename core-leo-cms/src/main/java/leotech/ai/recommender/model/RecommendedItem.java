package leotech.ai.recommender.model;

/**
 * @author Trieu 
 * 
 * The recommended item with score
 *
 */
public class RecommendedItem extends Item implements Comparable<RecommendedItem> {
	
	final double score;
	
	public RecommendedItem(Item item, double score) {
		super(item.name);
		this.score = score;
	}

	@Override
	public int compareTo(RecommendedItem o) {
		if(this.score > o.score) {
			return -1;
		} 
		else if(this.score < o.score) {
			return 1;
		}
		return 0;
	}

	public double getScore() {
		return score;
	}
	
}
