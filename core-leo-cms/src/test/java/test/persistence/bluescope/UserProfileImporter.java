package test.persistence.bluescope;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.List;

import com.google.gson.Gson;
import com.univocity.parsers.tsv.TsvParser;
import com.univocity.parsers.tsv.TsvParserSettings;

import leotech.cms.dao.UserDaoUtil;
import leotech.cms.model.MediaNetwork;
import leotech.cms.model.User;

public class UserProfileImporter {

    public static void main(String[] args) {
	try {
	    TsvParserSettings settings = new TsvParserSettings();
	    TsvParser parser = new TsvParser(settings);

	    String pathname = "./data/SalesTeamList.tsv";
	    // parses all rows in one go.
	    List<String[]> allRows = parser.parseAll(new FileReader(new File(pathname)));
	    allRows.stream().forEach(data -> {
		String displayName = data[0];
		String email = data[1];
		String department = data[2];
		String position = data[3];
		String userLogin = email.split("@")[0];
		String pass = "12345678";
		User user = new User(userLogin,pass, displayName, email, MediaNetwork.DEFAULT_ID);
		user.addCustomData("position", position);
		user.addCustomData("department", department);
		user.setStatus(User.STATUS_ACTIVE);
		user.setRole(User.ROLE_STANDARD_USER);
		UserDaoUtil.createNew(user);
		System.out.println(new Gson().toJson(user));
	    });
	} catch (FileNotFoundException e) {
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }
}