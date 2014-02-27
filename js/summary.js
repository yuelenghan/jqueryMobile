/**
 * Created by lh on 14-2-27.
 */
function testTable() {
    var tableStr = "<tr><td>插入3</td><td>插入</td><td>插入</td><td>插入</td><td>插入</td></tr>"
    $(tableStr).insertAfter($("#dbjhb-result tr:eq(1)"));

}