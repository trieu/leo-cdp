package leotech.ai.recommender.algorithms;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.SortedSet;
import java.util.TreeSet;

import leotech.ai.recommender.input.InputData;
import leotech.ai.recommender.model.Item;
import leotech.ai.recommender.model.RecommendedItem;
import leotech.cdp.model.audience.Profile;

/**
 * https://en.wikipedia.org/wiki/Slope_One
 * 
 * Slope One algorithm implementation
 */
public class SlopeOne {

	private static Map<Item, Map<Item, Double>> diff = new HashMap<>();
	private static Map<Item, Map<Item, Integer>> freq = new HashMap<>();
	private static Map<Profile, HashMap<Item, Double>> inputData;
	private static Map<Profile, HashMap<Item, Double>> outputData = new HashMap<>();

	public static void slopeOne(int numberOfUsers) {
		inputData = InputData.initializeData(numberOfUsers);
		System.out.println("Slope One - Before the Prediction\n");
		buildDifferencesMatrix(inputData);
		System.out.println("\nSlope One - With Predictions\n");
		predict(inputData);
	}

	/**
	 * Based on the available data, calculate the relationships between the
	 * items and number of occurences
	 * 
	 * @param data existing Profile data and their items' ratings
	 */
	private static void buildDifferencesMatrix(Map<Profile, HashMap<Item, Double>> data) {
		for (HashMap<Item, Double> profile : data.values()) {
			for (Entry<Item, Double> e : profile.entrySet()) {
				if (!diff.containsKey(e.getKey())) {
					diff.put(e.getKey(), new HashMap<Item, Double>());
					freq.put(e.getKey(), new HashMap<Item, Integer>());
				}
				for (Entry<Item, Double> e2 : profile.entrySet()) {
					int oldCount = 0;
					if (freq.get(e.getKey()).containsKey(e2.getKey())) {
						oldCount = freq.get(e.getKey()).get(e2.getKey()).intValue();
					}
					double oldDiff = 0.0;
					if (diff.get(e.getKey()).containsKey(e2.getKey())) {
						oldDiff = diff.get(e.getKey()).get(e2.getKey()).doubleValue();
					}
					double observedDiff = e.getValue() - e2.getValue();
					freq.get(e.getKey()).put(e2.getKey(), oldCount + 1);
					diff.get(e.getKey()).put(e2.getKey(), oldDiff + observedDiff);
				}
			}
		}
		for (Item j : diff.keySet()) {
			for (Item i : diff.get(j).keySet()) {
				double oldValue = diff.get(j).get(i).doubleValue();
				int count = freq.get(j).get(i).intValue();
				diff.get(j).put(i, oldValue / count);
			}
		}
		printData(data);
	}

	/**
	 * Based on existing data predict all missing ratings. If prediction is not
	 * possible, the value will be equal to -1
	 * 
	 * @param data
	 *            existing Profile data and their items' ratings
	 */
	private static void predict(Map<Profile, HashMap<Item, Double>> data) {
		HashMap<Item, Double> uPred = new HashMap<Item, Double>();
		HashMap<Item, Integer> uFreq = new HashMap<Item, Integer>();
		for (Item j : diff.keySet()) {
			uFreq.put(j, 0);
			uPred.put(j, 0.0);
		}
		for (Entry<Profile, HashMap<Item, Double>> e : data.entrySet()) {
			for (Item j : e.getValue().keySet()) {
				for (Item k : diff.keySet()) {
					try {
						double predictedValue = diff.get(k).get(j).doubleValue()+ e.getValue().get(j).doubleValue();
						double finalValue = predictedValue * freq.get(k).get(j).intValue();
						uPred.put(k, uPred.get(k) + finalValue);
						uFreq.put(k, uFreq.get(k) + freq.get(k).get(j).intValue());
					} catch (NullPointerException e1) {
					}
				}
			}
			HashMap<Item, Double> profileItemMatrix = new HashMap<Item, Double>();
			for (Item j : uPred.keySet()) {
				if (uFreq.get(j) > 0) {
					profileItemMatrix.put(j, uPred.get(j).doubleValue() / uFreq.get(j).intValue());
				}
			}
			for (Item j : InputData.getAllItems()) {
				if (e.getValue().containsKey(j)) {
					profileItemMatrix.put(j, e.getValue().get(j));
				} else if (!profileItemMatrix.containsKey(j)) {
					profileItemMatrix.put(j, -1.0);
				}
			}
			outputData.put(e.getKey(), profileItemMatrix);
		}
		printData(outputData);
	}

	private static void printData(Map<Profile, HashMap<Item, Double>> data) {
		for (Profile profile : data.keySet()) {
			System.out.println(profile + ":");
			HashMap<Item, Double> itemsAndScore = data.get(profile);
			
			SortedSet<RecommendedItem> recommendedItems = new TreeSet<>();
			itemsAndScore.forEach((Item i,Double s)->{
				recommendedItems.add(new RecommendedItem(i, s));
			});
			
			print(recommendedItems);
		}
	}

	private static void print(SortedSet<RecommendedItem> recommendedItems) {
		NumberFormat formatter = new DecimalFormat("#0.000");
		for (RecommendedItem j : recommendedItems) {
			System.out.println(" " + j.getName() + " --> " + formatter.format(j.getScore()));
		}
	}
	
	public static void main(String[] args) {
		SlopeOne.slopeOne(5);
	}

}