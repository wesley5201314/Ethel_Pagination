<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="zh-cn">
    <head>
        <title>分页演示</title>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1"/>
        <meta name="renderer" content="webkit"/>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="<c:url value="/resources/plugins/bootstrap/css/bootstrap.min.css"/>">
        <link rel="stylesheet" href="<c:url value="/resources/plugins/font-awesome/css/font-awesome.min.css"/>">
        <link rel="stylesheet" href="<c:url value="/resources/plugins/data-table/data-table.css"/>">
        <link rel="stylesheet" href="<c:url value="/resources/plugins/msg/msg.css"/>">
        <link rel="stylesheet" href="<c:url value="/resources/styles/common/common.css"/>">
        <link rel="stylesheet" href="<c:url value="/resources/styles/module/list-query.css"/>">
        <script src="<c:url value="/resources/plugins/jquery/jquery.min.js"/>"></script>
        <script src="<c:url value="/resources/plugins/bootstrap/js/bootstrap.min.js"/>"></script>
        <script src="<c:url value="/resources/scripts/module/list-query.js"/>"></script>
        <script src="<c:url value="/resources/plugins/data-table/data-table.js"/>"></script>
        <script src="<c:url value="/resources/plugins/msg/msg.js"/>"></script>
    </head>
<body>
<div class="title-panel">
            <h4>分页演示</h4>
        </div>
                <table id="list-dtb" class="data-table data-table-striped"
               data-ajax-request-url="<c:url value="/rest/dataList"/>">
            <thead>
            <tr>
                <th data-dtb-width="40" data-dtb-col="id">id</th>
                <th data-dtb-width="20" data-dtb-col="lpname">lpname</th>
                <th data-dtb-width="20" data-dtb-col="lplocation">lplocation</th>
                <th data-dtb-width="10" data-dtb-col="sequence">sequence</th>
                <th data-dtb-width="10" data-dtb-col="operate">operate</th>
            </tr>
            </thead>
        </table>
</body>
</html>