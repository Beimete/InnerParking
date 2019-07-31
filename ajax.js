/**
 * Update status of spots in the parking lot
 * Green means spot is available,
 * Red means spot is unavailable.
 */
var str = "2016-03-01";
var stCount = setInterval(function(){
    var date = new Date(str);
    var dcount = date.getDate();
    // JS中31号加一自动变成1号 if条件如果设成 dcount<32 死循环?
    if(dcount<31){
        console.log("now the date:",str);
        console.log("即将第"+dcount+"次执行updateStatus()啦！");
        updateStatus(str);
        str = changeURL(str);
        // console.log("the next str:",str);
    }else{
        // 为了补偿2016-03-31号
        console.log("now the date:",str);
        updateStatus("2016-03-31");
        clearInterval(stCount);
    }
},1000);

/** 2016-03-01~2016-03-31 日期自增一 格式:yyyy-mm-dd */
function changeURL(str){
    var date = new Date(str);
    date.setDate(date.getDate() + 1);
    // console.log(date.getDate() + 1);
    if(date.getDate()<=9 && parseInt(date.getMonth()) + 1<=9){
        str = date.getFullYear()+'-'+'0'+(parseInt(date.getMonth()) + 1) + '-'+'0'+ date.getDate();
    }else if(parseInt(date.getMonth()) + 1<=9){
        str = date.getFullYear() + '-'+'0'+ (parseInt(date.getMonth()) + 1) + '-'+ date.getDate();
    }else if(date.getDate()<=9){
        str = date.getFullYear() + '-'+ (parseInt(date.getMonth()) + 1) + '-'+'0'+ date.getDate();
    }else{
        str = date.getFullYear() + '-'+ (parseInt(date.getMonth()) + 1) + '-'+ date.getDate();
    };
    return str;
}

function updateStatus(stime){
    $.ajax({
    url:"http://192.168.8.180:8080/ddtcExcelServer/rentable/getLockRentableState?token=da5b9f122ed141c6bbcf9453816afdaf201907240&areaId=6&startTime="+stime+"+00%3A00%3A00",
    type: "GET",
    dataType: "json",
    success: function(data){
       console.log(data);
       for(var i=1; i<50; i++){
           mylot = document.getElementById('P_'+i);
           for(var j=0; j<data.rentableStateList.length; j++){
                if('P_'+data.rentableStateList[j].areaCode==mylot.id){
                    // console.log(mylot.id);
                    if(data.rentableStateList[j].state==0){
                        $('#P_'+i).css({fill:'green'});
                    }else{
                        $('#P_'+i).css({fill:'red'});
                    }
                } 
            }
        }         
    },
        error: function(error){
            alert(error)
        }
});
}
