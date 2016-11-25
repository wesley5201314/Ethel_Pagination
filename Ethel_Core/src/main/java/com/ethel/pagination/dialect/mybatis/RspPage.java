package com.ethel.pagination.dialect.mybatis;

import java.io.Serializable;
import java.util.List;

/** <br>
 * 描述: 分页返回参数<br>
 * 公司: www.tydic.com<br>
 * 
 * @autho wesley
 * @time 2016年11月24日 下午3:14:05 */
public class RspPage<T> implements Serializable {

	/**  */
	private static final long serialVersionUID = -7485827693286591127L;

	/** 数据 */
	private List<T>			  rows;

	/** 记录总数 */
	private int				  total;

	/** 总页数 */
	private int				  totalPages;

	/** 返回 数据
	 * 
	 * @return 数据 */
	public List<T> getRows() {
		return rows;
	}

	/** 设置 数据
	 * 
	 * @param data
	 *        数据 */
	public void setRows(List<T> rows) {
		this.rows = rows;
	}

	/** 返回 记录总数
	 * 
	 * @return 记录总数 */
	public int getTotal() {
		return total;
	}

	/** 设置 记录总数
	 * 
	 * @param total
	 *        记录总数 */
	public void setTotal(int total) {
		this.total = total;
	}

	/** 返回 总页数
	 * 
	 * @return 总页数 */
	public int getTotalPages() {
		return totalPages;
	}

	/** 设置 总页数
	 * 
	 * @param totalPages
	 *        总页数 */
	public void setTotalPages(int totalPages) {
		this.totalPages = totalPages;
	}

	@Override
	public String toString() {
		return "RspPage [rows=" + rows + ", total=" + total + ", totalPages=" + totalPages + "]";
	}

}
