package com.ethel.pagination.demo.po;

public class Property {
    private String id;

    private String lpname;

    private String lplocation;

    private Integer sequence;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id == null ? null : id.trim();
    }

    public String getLpname() {
        return lpname;
    }

    public void setLpname(String lpname) {
        this.lpname = lpname == null ? null : lpname.trim();
    }

    public String getLplocation() {
        return lplocation;
    }

    public void setLplocation(String lplocation) {
        this.lplocation = lplocation == null ? null : lplocation.trim();
    }

    public Integer getSequence() {
        return sequence;
    }

    public void setSequence(Integer sequence) {
        this.sequence = sequence;
    }
}