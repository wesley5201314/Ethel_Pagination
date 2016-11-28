package com.ethel.pagination.dialect;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.ethel.pagination.helper.AbstractHelper;

/**
 * 
 * <br>
 * 描述: MSSQL 数据库方言 分页<br>
 * 公司: www.tydic.com<br>
 * @autho wesley
 * @time 2016年11月24日 上午11:09:23
 */
public class MSPageHelper extends AbstractHelper{
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
        int selectIndex = querySelect.toUpperCase().lastIndexOf("SELECT");
        if (selectIndex > -1) {
            querySelect = querySelect.substring(0, selectIndex) + "SELECT TOP " + (limit + offset) + querySelect.substring(selectIndex + 6);
        }
        String sql = "SELECT * FROM(SELECT ROW_NUMBER () OVER (ORDER BY getdate()) rownum,* FROM( " + querySelect + " ) A ) B WHERE B.rownum > " + offset + " AND B.rownum <= "
                + (limit + offset);
        return sql;

    }

}
