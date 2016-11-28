package com.ethel.pagination.dialect;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.ethel.pagination.helper.AbstractHelper;

/**
@since 2014年7月2日 上午10:30:14
**/
public class PostgrePageHelper extends AbstractHelper{
    /**
     * 得到查询总数的sql
     */
    public static String getCountString(String querySelect) {
        querySelect = getLineSql(querySelect);
        int orderIndex = getLastOrderInsertPoint(querySelect);

        int formIndex = getAfterFormInsertPoint(querySelect);
        String select = querySelect.substring(0, formIndex);

        // 如果SELECT 中包含 DISTINCT 只能在外层包含COUNT
        if (select.toLowerCase().indexOf("select distinct") != -1 || querySelect.toLowerCase().indexOf("group by") != -1) {
            return new StringBuffer(querySelect.length()).append("select count(1) count from (").append(querySelect.substring(0, orderIndex)).append(" ) t").toString();
        } else {
            return new StringBuffer(querySelect.length()).append("select count(1) count ").append(querySelect.substring(formIndex, orderIndex)).toString();
        }
    }

    /**
     * 得到分页的SQL
     * 
     * @param offset
     *            偏移量
     * @param limit
     *            位置
     * @return 分页SQL
     */
    public static String getLimitString(String querySelect, int offset, int limit) {
        querySelect = getLineSql(querySelect);
        String sql = querySelect + " LIMIT " + limit + " OFFSET " + offset;
        return sql;
    }
}
