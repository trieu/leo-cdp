package leotech.cdp.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import leotech.cdp.model.analytics.Notebook;

public class Analytics360Service {
	
	static Map<String, Notebook> notebooks = new HashMap<String, Notebook>();
	static {
		//FIXME move to database
		
		Notebook n = new Notebook("analytics", "Customer Analytics with RFM and Visualization");
		n.setAccessToken("12345");
		notebooks.put(n.getId(), n);
		
//		n = new Notebook("scoring", "Data Quality Scoring Model");
//		n.setAccessToken("12345");
//		notebooks.put(n.getId(), n);
//		
//		n = new Notebook("scoring", "Lead Scoring Model");
//		n.setAccessToken("12345");
//		notebooks.put( n.getId(), n);
//		
//		n = new Notebook("processor", "Profile Data Identity Resolution");
//		n.setAccessToken("12345");
//		notebooks.put(n.getId(), n);
//		
//		n = new Notebook("scoring", "Customer Lifetime Value Scoring Model");
//		n.setAccessToken("12345");
//		notebooks.put(n.getId(), n);
	}

	public static List<Notebook> getNotebooks(int startIndex, int numberResult){
		
		return new ArrayList<Notebook>(notebooks.values());
	}
	
	public static String runAndExportToHtmlFile(String id) {
		Notebook notebook = notebooks.get(id);
		String nbName = notebook.getJupyterFileUri();
		String pyName = notebook.getPythonFileUri();
		String htmlName = notebook.getHtmlFileUri();
		
		String outputName = nbName.replace(".ipynb", "-output.ipynb");
		String runNbCommand = "papermill "+nbName+" output.ipynb "+nbName;
		String convertToHtmlCommand = "jupyter nbconvert --to html "+nbName;
		return htmlName;
	}
	
	
	
	public static void main(String[] args) {
		
	}
}
