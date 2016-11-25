package com.ethel.pagination.demo.dao;

import java.util.List;

import com.ethel.pagination.demo.po.Property;
import com.ethel.pagination.dialect.mybatis.Page;
import com.ethel.pagination.dialect.mybatis.RspPage;

public interface PropertyMapper {
    int deleteByPrimaryKey(String id);

    int insert(Property record);

    int insertSelective(Property record);

    Property selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(Property record);

    int updateByPrimaryKey(Property record);

	List<Property> queryList(Page<Property> page);
}