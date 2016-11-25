package com.ethel.pagination.demo.controller;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ethel.pagination.demo.po.Property;
import com.ethel.pagination.demo.service.PropertyService;
import com.ethel.pagination.dialect.mybatis.RspPage;
/**
 * 
 * <br>
 * 描述: rest风格的返回数据<br>
 * 公司: www.tydic.com<br>
 * @autho wesley
 * @time 2016年11月24日 下午5:18:15
 */
@RestController
public class RestDataController {

	@Resource
	private PropertyService propertyService;
	
	@RequestMapping("/dataList")
	public RspPage<Property> list(Integer pageIndex, Integer pageSize){
		if(null == pageIndex){
    		pageIndex = 1; //默认从第一页开始查
    	}
		pageIndex = pageIndex + 1; //dataTable插件默认传递的是第一页，需要加1
    	if(null == pageSize){
    		pageSize = 10; //一页10条数据
    	}
    	//返回数据
		RspPage<Property> pages = propertyService.queryList(pageIndex,pageSize);
		return pages;
	}
}
