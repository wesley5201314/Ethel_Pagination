package com.ethel.pagination.dialect;

/**
 * 
 * <br>
 * 描述: MySQL数据库方言<br>
 * 公司: www.tydic.com<br>
 * @autho wesley
 * @time 2016年11月24日 上午11:10:08
 */
public class MySql5Dialect extends Dialect {

    protected static final String SQL_END_DELIMITER = ";";

    @Override
    public String getLimitString(String sql, int offset, int limit) {
        return MySql5PageHepler.getLimitString(sql, offset, limit);
    }

    @Override
    public String getCountString(String sql) {
        return MySql5PageHepler.getCountString(sql);
    }
}
