package com.ethel.pagination.dialect;

/**
 * 
 * <br>
 * 描述: Postgre 数据库 方言<br>
 * 公司: www.tydic.com<br>
 * @autho wesley
 * @time 2016年11月24日 上午11:13:22
 */
public class PostgreDialect extends Dialect {

    protected static final String SQL_END_DELIMITER = ";";

    @Override
    public String getLimitString(String sql, int offset, int limit) {
        return PostgrePageHepler.getLimitString(sql, offset, limit);
    }

    @Override
    public String getCountString(String sql) {
        return PostgrePageHepler.getCountString(sql);
    }
}
