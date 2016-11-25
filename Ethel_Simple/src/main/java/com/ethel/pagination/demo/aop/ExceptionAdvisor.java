package com.ethel.pagination.demo.aop;

import java.lang.reflect.Method;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.core.Ordered;

/**
 * 
 * <br>
 * 描述: 增加异常处理aop。<br>
 * 公司: www.tydic.com<br>
 * @autho wesley
 * @time 2016年11月24日 下午1:28:50
 */
public class ExceptionAdvisor implements Ordered {

	private final static Log    log = LogFactory.getLog(ExceptionAdvisor.class);

	/** @param pjp
	 * @return
	 * @throws Throwable */
	public Object throwAopTreat(ProceedingJoinPoint pjp) throws Throwable {

		MethodSignature methodSignature = (MethodSignature) pjp.getSignature();
		Method method = methodSignature.getMethod();

		Class<?> objClass = method.getReturnType();

		log.info("事务开始...");

		Object object = null;

		try {
			object = pjp.proceed();

			return object;
		}
		catch (Exception e) {
			log.error("业务异常  ", e);
			object = objClass.newInstance();
		}
		catch (Throwable e) {
			log.error("系统异常  ", e);
			object = objClass.newInstance();
		}
		log.info("事务结束...");
		return object;
	}
	@Override
	public int getOrder() {
		return 100;
	}
}
