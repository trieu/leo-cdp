package leotech.ai.recommender.input;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import leotech.ai.recommender.model.Item;
import leotech.cdp.model.customer.Profile;

public class InputData {

    protected static List<Item> items = Arrays.asList(new Item("Candy"), new Item("Drink"), new Item("Soda"), new Item("Popcorn"), new Item("Snacks"));

    public static List<Item> getAllItems() {
		return items;
	}
    
    public static Map<Profile, HashMap<Item, Double>> initializeData(int numberOfUsers) {
        Map<Profile, HashMap<Item, Double>> data = new HashMap<>();
        HashMap<Item, Double> linkedItemWithScore;
        
        int maxSize = 3;
        for (int i = 0; i < numberOfUsers; i++) {
            linkedItemWithScore = new HashMap<Item, Double>();
            Set<Item> linkedItem = new HashSet<>(maxSize);
           
            // sample for testing 
			for (int j = 0; j < maxSize; j++) {
				double ran = Math.random();
                Item item = items.get((int) (ran * items.size()));
                linkedItem.add(item);
            }
			
			// interest voting 
            for (Item item : linkedItem) {
            	double votedScore = Math.random();
                linkedItemWithScore.put(item, votedScore);
            }
            data.put(new Profile("Profile " + i), linkedItemWithScore);
        }
        return data;
    }

}