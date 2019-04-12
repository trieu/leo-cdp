package test.analytics;

import static org.junit.Assert.assertTrue;

import org.junit.Ignore;
import org.junit.Test;

import com.clearspring.analytics.hash.MurmurHash;
import com.clearspring.analytics.stream.frequency.ConservativeAddSketch;
import com.clearspring.analytics.stream.frequency.CountMinSketch;
import com.clearspring.experimental.stream.cardinality.HyperBitBit;

import leotech.system.util.RandomCollection;
import rfx.core.util.RandomUtil;

public class StreamMining {

    @Test
    public void testSize() {
	int seed = 2000000;
	double epsOfTotalCount = 0.00001;
	double confidence = 0.99999;

	CountMinSketch sketch = new ConservativeAddSketch(epsOfTotalCount, confidence, seed);

	RandomCollection<Integer> ranSet = new RandomCollection<>();
	ranSet.add(10, 1);
	ranSet.add(70, 2);
	ranSet.add(20, 3);
	int total = 0;
	for (int i = 0; i < 1000000; i++) {
	    int count = 1;
	    int item = RandomUtil.getRandomInteger(100000, 1);
	    if(item == 1) {
		total += count;
	    }	    
	    sketch.add(item, count);
	}

	System.out.println(total);
	System.out.println(sketch.estimateCount(1));
	System.out.println(sketch.estimateCount(2));
	System.out.println(sketch.estimateCount(3));
    }

    @Test
    @Ignore
    public void testHash() {
	System.out.println(MurmurHash.hash64("https://www.youtube.com/watch?v=11KP0QAF7T4"));
    }

    @Test
    @Ignore
    public void testMultipleOrderedHighCardinality() {
	int size = 100000;

	long start = System.currentTimeMillis();

	HyperBitBit hyperBitBit = new HyperBitBit();

	for (int i = 0; i < size; i++) {
	    hyperBitBit.offer(i);
	    hyperBitBit.offer(i);
	    hyperBitBit.offer(i);
	    hyperBitBit.offer(i);
	}

	System.out.println("time: " + (System.currentTimeMillis() - start));
	long estimate = hyperBitBit.cardinality();

	System.out.println(estimate);
	double err = Math.abs(estimate - size) / (double) size;
	System.out.println(err);
	System.out.println("This value should be less than 0.2: " + err);
	assertTrue(err < 0.2);
    }

}
