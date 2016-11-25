package com.ethel.pagination.dialect;

import org.apache.ibatis.session.Configuration;

/**
 * 
 * <br>
 * 描述: 数据库方言工厂,产生方言对象<br>
 * 公司: www.tydic.com<br>
 * @autho wesley
 * @time 2016年11月24日 上午11:07:16
 */
public class DialectFactory {

    public static String dialectClass = null;

    public static Dialect buildDialect(Configuration configuration) {
        if (dialectClass == null) {
            synchronized (DialectFactory.class) {
                if (dialectClass == null) {
                    dialectClass = configuration.getVariables().getProperty("dialectClass");
                }
            }
        }
        Dialect dialect = null;
        try {
        	//利用反射机制获取方言对象
            dialect = (Dialect) Class.forName(dialectClass).newInstance();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return dialect;
    }
}
