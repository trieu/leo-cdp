package leotech.cdp.query;

import java.util.List;

import leotech.cdp.model.customer.Profile;
import rfx.core.util.StringUtil;

/**
 * ProfileQuery Builder
 * 
 * @author tantrieuf31
 * @since 2020
 *
 */
public class ProfileQueryBuilder {

	public static String buildAqlString(boolean filterCreateAt, String beginFilterDate, String endFilterDate,
			String parsedFilterAql, int startIndex, int numberResult, List<String> profileFields) {
		String timeFieldName = filterCreateAt ? " d.createdAt " : " d.updatedAt ";

		StringBuilder aql = new StringBuilder("FOR d in ").append(Profile.COLLECTION_NAME);
		aql.append(" FILTER d.status > 0 ");
		
		if (StringUtil.isNotEmpty(beginFilterDate) && StringUtil.isNotEmpty(endFilterDate)) {
			aql.append(" AND ( ").append(timeFieldName).append(" >= '").append(beginFilterDate).append("' AND ");
			aql.append(timeFieldName).append(" <= '").append(endFilterDate).append("' ) ");
		}
		
		if (!parsedFilterAql.isEmpty()) {
			aql.append(" AND ").append(parsedFilterAql);
		}
		aql.append(" LIMIT ").append(startIndex).append(",").append(numberResult);

		// only selected fields are returned
		int size = profileFields.size();
		if (size == 0) {
			aql.append(" RETURN d ");
		} else {
			aql.append(" RETURN { ");
			for (int i = 0; i < size; i++) {
				String field = profileFields.get(i);
				if (field.equals("id")) {
					aql.append(field).append(":").append("d._key");
				} else {
					aql.append(field).append(":").append("d.").append(field);
				}

				if (i < size - 1) {
					aql.append(", ");
				}
			}
			aql.append(" } ");
		}
		return aql.toString();
	}
	
	public static String buildCoutingQuery(String parsedFilterAql) {
		return buildCoutingQuery(false, null, null, parsedFilterAql);
	}

	public static String buildCoutingQuery(boolean filterCreateAt, String beginFilterDate, String endFilterDate, String parsedFilterAql) {
		String timeFieldName = filterCreateAt ? " d.createdAt " : " d.updatedAt ";
		StringBuilder aql = new StringBuilder("RETURN LENGTH( FOR d in ").append(Profile.COLLECTION_NAME);
		aql.append(" FILTER d.status > 0 ");

		if (StringUtil.isNotEmpty(beginFilterDate) && StringUtil.isNotEmpty(endFilterDate)) {
			aql.append(" AND ( ").append(timeFieldName).append(" >= '").append(beginFilterDate).append("' AND ");
			aql.append(timeFieldName).append(" <= '").append(endFilterDate).append("' ) ");
		}

		if (!parsedFilterAql.isEmpty()) {
			aql.append(" AND ").append(parsedFilterAql);
		}
		aql.append(" RETURN {id:d._key} ) ");

		return aql.toString();
	}
}
