package com.ethel.pagination.dialect;

/**
 * 
 * <br>
 * 描述: 数据库方言抽象类<br>
 * 公司: www.tydic.com<br>
 * @autho wesley
 * @time 2016年11月24日 上午11:02:46
 */
public abstract class Dialect {

    /**
     * 得到分页sql
     * 
     * @param sql
     * @param offset
     * @param limit
     * @return
     */
    public abstract String getLimitString(String sql, int offset, int limit);

    /**
     * 得到总数量 sql
     * 
     * @param sql
     * @return
     */
    public abstract String getCountString(String sql);

}
