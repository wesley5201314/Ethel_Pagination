package com.ethel.pagination.dialect;

/**
 * 
 * <br>
 * 描述: Oracle数据库方言<br>
 * 公司: www.tydic.com<br>
 * @autho wesley
 * @time 2016年11月24日 上午11:11:19
 */
public class OracleDialect extends Dialect {

    @Override
    public String getLimitString(String sql, int offset, int limit) {
       return OraclePageHepler.getLimitString(sql, offset, limit);
    }

    @Override
    public String getCountString(String sql) {
        return OraclePageHepler.getCountString(sql);
    }
}
