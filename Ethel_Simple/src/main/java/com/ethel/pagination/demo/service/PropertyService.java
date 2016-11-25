package com.ethel.pagination.demo.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.ethel.pagination.demo.dao.PropertyMapper;
import com.ethel.pagination.demo.po.Property;
import com.ethel.pagination.dialect.mybatis.Page;
import com.ethel.pagination.dialect.mybatis.RspPage;

@Service
public class PropertyService {
	
	@Resource
	private PropertyMapper propertyMapper;

	public RspPage<Property> queryList(Integer pageNo, Integer pageSize) {
		//分页对象
		Page<Property> page = new Page<Property>(pageNo,pageSize);
		List<Property> list = propertyMapper.queryList(page);
		//分页数据返回
		RspPage<Property> rspPage = new RspPage<Property>();
		rspPage.setRows(list);
		rspPage.setTotal(page.getTotalCount());
		rspPage.setTotalPages(page.getTotalPages());
		return rspPage;
	}

}
