package com.ethel.pagination.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 
 * <br>
 * 描述: 普通请求地址<br>
 * 公司: www.tydic.com<br>
 * @autho wesley
 * @time 2016年11月24日 下午5:18:41
 */
@Controller
public class IndexController {
	
	@RequestMapping("/index")
	public String index(){
		return "list";
	}
}
