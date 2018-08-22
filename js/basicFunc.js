function generateEquation() {//生成算式
    var operator = setOperator(); //str型 "+" "-"
    var scope_max = getScope()[1];//int
    var scope_min = getScope()[0];//int
    var result = 0;
//    var num2 = nums[1]; //int型
    if (operator === "+") {
        var num1 = setNums();//int
        var diff = scope_max - num1;
        var num2 = parseInt(Math.random() * (diff - scope_min + 1) + scope_min);
    }
    if (operator === "-") {//减法算式
        var num1 = setNums();//int
        var diff = parseInt(scope_max - scope_min);
        var num2 = parseInt(Math.random() * (diff + 1) + scope_min);
        if (num1 < num2) {//如果被减数小于减数则互换位置
            var temp = 0;
            temp = num1;
            num1 = num2;
            num2 = temp;
        }
    }
    if (operator === '*') {
        operator = 'x';
        var sqrt = Math.sqrt(scope_max);
        var num1 = parseInt(Math.random() * (sqrt + 1) + 1);
        var diff = scope_max / num1 - scope_min;
        var num2 = parseInt(Math.random() * diff);
    }
    if (operator === '/') {
        operator = '÷';
        var sqrt = Math.sqrt(scope_max);
        var temp1 = parseInt(Math.random() * (sqrt + 1) + 1);
        var temp2 = parseInt(scope_max / temp1);
        var temp3 = parseInt(Math.random() * temp2 + 1);
        var num1 = temp3 * temp1;
        var num2Arr = [temp1,temp3];
        var charIndex = Math.floor(Math.random() * 2);
        var num2 = num2Arr[charIndex];
    }
    var num1str = num1 + ""; //int型转换为str型
    var num2str = num2 + ""; //同上
    var equation = num1str + " " + operator + " " + num2str + " = ";
    if (operator === "-") {
        result = num1 - num2;
    } else if (operator === '+') {
        result = num1 + num2;
    } else if (operator === 'x') {
        result = num1 * num2;
    } else {
        result = num1 / num2;
    }
    return [equation, result];
}

function printEquation() {//打印算式
    var is_show = document.getElementById("isImport").innerHTML;
    if (is_show !== '') {
        document.getElementById("isImport").innerHTML = "";
    }
    hideAnswers();
    var equationCounts = getEquationCounts();
    var outputarea = document.getElementById("outputarea");
    var eTableHeader = "<table id='answerTable' class='table table-bordered table-striped table-hover' style='text-align: center; font-weight: bold;'>";
    var eTableBody = "<tr><th>序号</th><th>算式</th><th>结果</th><th id='thResult' style='display:none'>答案</th></tr>";
    for (var i = 0; i < equationCounts; i++) {//将算式作为table的一行循环输出
        var equation = generateEquation();
        var equationBody = equation[0];
        var result = equation[1];
        eTableBody += "<tr class='' id='eTableBodyTr" + (i + 1) + "'" + "><td>" + (i + 1) + "</td><td>" + equationBody + "</td><td><input id='userAnswer" + (i + 1) + "'" + " class='form-control' type='text' placeholder='answer'/></td><td id='tdResult" + i + "' style='display:none'>" + result + "</td></tr>"; //动态地为table的每一行添加一个id，动态地为每一行中需要用户输入的input标签添加一个id，并将算式答案隐藏在每一行的第四列
    }
    var eTableFooter = "</table>";
    var eTable = eTableHeader + eTableBody + eTableFooter;
    outputarea.innerHTML = eTable;
    document.getElementById("upBtn").innerHTML = "<a href='#top'><image src='image/up.jpg' style='height: 50px; width: 50px'/></a>"; //添加快速返回顶部的按钮
    document.getElementById("footer").innerHTML = "<p class='text-info'>-----------------------------------------------------------  到底啦  -----------------------------------------------------------</p>"; //在页面底部添加“到底啦”提示
}

function setNums() {//生成两个随机数
    var scope = getScope();
    var min = scope[0];
    var max = scope[1];
    var diff = parseInt(max - min);
    var num1 = parseInt(Math.random() * (diff + 1) + min);
//    var num2 = parseInt(Math.random() * (diff + 1) + min);
    return num1;
}

function setOperator() {//生成随机运算符
    operatorsArr = [];
    var checkBox = document.getElementsByName("operator");
    for (var i = 0; i < checkBox.length; i++) {
        if (checkBox[i].checked) {
            var operator = checkBox[i].value;
            var operatorCounts = operatorsArr.push(operator); //运算符入队并保存运算符的数量
        }
    }
    var charIndex = Math.floor(Math.random() * operatorCounts);
    var operatorSelect = operatorsArr[charIndex];
    return operatorSelect;
}

function getScope() {//出题范围
    var scope_min = parseInt(document.getElementById("scope-min").value);
    var scope_max = parseInt(document.getElementById("scope-max").value);
    return [scope_min, scope_max];
}

function getEquationCounts() {//出题数量
    var equationCounts = parseInt(document.getElementById("equationCounts").value);
    return equationCounts;
}

function checkEquation() {//检查对错
    var table = document.getElementById("answerTable"); //获取到包含算式的table对象
    if (table !== null) {
        var rows = table.rows;
        if (confirm("确定结束答题并开始检查吗？")) {
            var errorCounts = 0;
            for (var i = 1; i < rows.length; i++) {//遍历table的所有行，除第一行之外
                var userAnswer = parseInt(document.getElementById("userAnswer" + i).value); //动态地获取用户输入的答案
                var cells = rows[i].cells; //将每一行的数据赋值给cells对象
                var result = cells[3].innerHTML; //因为算式答案隐藏在每一行的第四列，所以直接提取cells[3]，与用户输入的答案进行比较
                if (parseInt(result) !== parseInt(userAnswer)) {
                    var eTableBodyTr = document.getElementById("eTableBodyTr" + i).className = 'danger'; //如果用户未作答或答案有误，则为该行添加一个红色背景
                    errorCounts += 1; //计数未答和错答的数量
                }
            }
            var accuracy = (((rows.length - 1 - errorCounts) / (rows.length - 1)).toFixed(2)) * 100; //计算正答率，rows.length - 1是因为table的第一行是无用数据
            var statistics = "本次练习共有<span style='font-size: 22px; font-weight: bold;'>" + (rows.length - 1) + "</span>题，你答对<span style='color: green; font-size: 22px; font-weight: bold;'>" + (rows.length - 1 - errorCounts) + "</span>题，答错<span style='color: red; font-size: 22px; font-weight: bold'>" + errorCounts + "</span>题，正答率为<span style='color: #6633FF; font-size: 22px; font-weight:bold;'>" + accuracy + "</span>%"; //显示统计结果
            document.getElementById("feedback").innerHTML = statistics;
        }
    } else {//没有获取到table对象，即用户还没有生成题目
        alert("你还没有生成题目！");
    }
}

function saveToCsv() {//保存到csv文件
    var csvRows = [];
    var datetime = getDateTime()[0];
    var table = document.getElementById("answerTable"); //获取到包含算式的table对象
    if (table !== null) {
        var rows = table.rows;
        for (var i = 1; i < rows.length; i++) {
            var cells = rows[i].cells;
            var equation = cells[1].innerHTML.toString() + "," + cells[3].innerHTML.toString();
            csvRows.push(equation);
        }
        var csvString = csvRows.join(";"); //一个算式作为一行
        var a = document.createElement('a');
        a.href = 'data:attachment/csv,' + encodeURI(csvString);
        a.target = "_blank";
        a.download = datetime + '.csv';
        document.body.appendChild(a); //创建a标签
        a.click();
        document.body.removeChild(a); //获取下载链接之后删除a标签
    } else {//没有获取到table对象，即用户还没有生成题目
        alert("你还没有生成题目！");
    }
}

function getDateTime() {//获取日期时间，用作csv文件名，基本同saveToCsv()
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = parseInt(myDate.getMonth() + 1);
    if (month < 10) {
        month = "0" + month;
    }
    var day = myDate.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    var hour = myDate.getHours();
    if (hour < 10) {
        hour = "0" + hour;
    }
    var minute = myDate.getMinutes();
    if (minute < 10) {
        minute = "0" + minute;
    }
    var datetime = "Exercise - " + year + month + day + hour + minute;
    var date = "" + year + month + day;
    return [datetime, date];
}

function saveToWord() {//保存到word文件
    var wordRows = [];
    var datetime = getDateTime()[0];
    var table = document.getElementById("answerTable");
    if (table !== null) {
        var rows = table.rows;
//        console.log("typeof rows[i]:" + typeof (rows[1]));     //object
//        console.log("rows.length:" + (rows.length - 1));
        for (var i = 1; i < rows.length; i++) {//rows.length  出题数
            var cells = rows[i].cells;
            var equation = cells[1].innerHTML.toString();
            wordRows.push(equation);
        }
        var rowItem = ""; //一行三个算式
        var newArray = [];
        if (wordRows.length % 3 === 0) {
            for (i in wordRows) {
                console.log("length: " + wordRows.length);
                if (i % 3 !== 2) {
                    rowItem += wordRows[i].toString();
                    rowItem += '\t\t\t';
                } else {//换行
                    rowItem += wordRows[i].toString();
                    rowItem += '\t\t';
                    newArray.push(rowItem);
                    rowItem = '';
                }
            }
        } else if (wordRows.length % 3 === 1) {
            for (i in wordRows) {
                console.log("length: " + wordRows.length);
                if (i % 3 !== 2) {
                    rowItem += wordRows[i].toString();
                    rowItem += '\t\t\t';
                } else {//换行
                    rowItem += wordRows[i].toString();
                    rowItem += '\t\t';
                    newArray.push(rowItem);
                    rowItem = '';
                }
            }
            newArray.push(wordRows[wordRows.length - 1].toString());
        } else if (wordRows.length % 3 === 2) {
            for (i in wordRows) {
                console.log("length: " + wordRows.length);
                if (i % 3 !== 2) {
                    rowItem += wordRows[i].toString();
                    rowItem += '\t\t\t';
                } else {//换行
                    rowItem += wordRows[i].toString();
                    rowItem += '\t\t';
                    newArray.push(rowItem);
                    rowItem = '';
                }
            }
            var extraItem = '';
            extraItem += wordRows[wordRows.length - 2].toString();
            extraItem += '\t\t\t';
            extraItem += wordRows[wordRows.length - 1].toString();
            newArray.push(extraItem);
        }

        var wordString = newArray.join("\n\n");
        var a = document.createElement('a');
        a.href = 'data:attachment/csv,' + encodeURI(wordString);
        a.target = "_blank";
        a.download = datetime + '.doc';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        alert("你还没有生成题目！");
    }
}

function login() {
    var loginArea = document.getElementById("loginArea");
    var is_show = loginArea.style.display;
    if (is_show === 'none') {
        loginArea.style.display = 'block';
    } else {
        loginArea.style.display = 'none';
    }
}

function checkAdmin() {
    adminId = document.getElementById("adminId").value;
    adminPass = document.getElementById("adminPass").value;
    var storage = window.localStorage;
//    alert("faf");
//    storage.setItem(adminId, adminPass);
//    storage.clear();
    if (adminId === storage.key(0)) {//有此账号
        if (adminPass === storage.getItem(adminId)) {//登陆成功
            document.getElementById("adminLogin").style.display = "none";
            document.getElementById("adminLogout").style.display = "block";
            document.getElementById("loginArea").style.display = 'none';
            document.getElementById("adminPass").value = ''; //清空密码
            nowOnline(adminId);
        } else {
            alert("密码错误");
        }
    } else {
        alert("账号错误");
    }
}

var onlineUser = "";
function nowOnline(userId) {
    onlineUser = userId;
    return onlineUser;
}

function showAnswers() {
    var table = document.getElementById("answerTable");
//    var equationCounts = getEquationCounts();
    if (table !== null) {
        var rows = table.rows;
        var is_show = document.getElementById("thResult").style.display;
        if (is_show === 'none') {
            document.getElementById("thResult").style.display = 'block';
            for (var i = 0; i < rows.length - 1; i++) {//将算式作为table的一行循环输出
                var tdResult = 'tdResult';
                tdResult += i;
                document.getElementById(tdResult).style.display = 'block';
            }
            document.getElementById("showAnswerBtn").style.display = 'none';
            document.getElementById("hideAnswerBtn").style.display = 'inline';
        } else {//已经显示了答案，需要隐藏
            hideAnswers();
        }
    } else {
        alert("你还没有生成算式，请先生成算式！");
        printEquation();
    }
}

function hideAnswers() {
//    var equationCounts = getEquationCounts();
    var table = document.getElementById("answerTable");
    if (table !== null) {
        var rows = table.rows;
        document.getElementById("thResult").style.display = 'none';
        for (var i = 0; i < rows.length - 1; i++) {//将算式作为table的一行循环输出
            var tdResult = 'tdResult';
            tdResult += i;
            document.getElementById(tdResult).style.display = 'none';
        }
    }
    document.getElementById("showAnswerBtn").style.display = 'inline';
    document.getElementById("hideAnswerBtn").style.display = 'none';
}

function showAlterArea() {
    var is_show = document.getElementById("alterArea").style.display;
    var today = getDateTime()[1];
    storage = window.localStorage;
    if (is_show === "none") {
        document.getElementById("alterArea").style.display = "block";
    } else {
        document.getElementById("alterArea").style.display = "none";
    }
    if (storage.date !== today) {//storage中存储的日期不是今天
        storage.date = today;
        storage.alterTimes = 0;
    }
    storage2 = window.localStorage;
    var alterTimes2 = parseInt(storage2.alterTimes);
    if (alterTimes2 < 2) {
        document.getElementById("alterBtn").style.background = null;
    } else {
        document.getElementById("alterBtn").style.background = "gray";
    }
    document.getElementById("alterTimesLeft").innerHTML = 2 - storage.alterTimes;
}

function alterPass() {
    var storage = window.localStorage;
    var alterTimes = parseInt(storage.alterTimes);
    if (alterTimes < 2) {
        var newPass = document.getElementById("newPass").value;
        if (newPass.length >= 4) {
            var storage = window.localStorage;
            if (onlineUser !== "") {
                storage[onlineUser] = newPass;
                alterTimes += 1;
                storage.alterTimes = alterTimes;
                alert("密码修改成功！");
                document.getElementById("newPass").value = "";
                document.getElementById("alterArea").style.display = "none";
                logout();
                document.getElementById("adminLogin").style.display = 'block';
            } else {
                alert("Error");
            }
        } else {
            alert("密码不能少于4位");
        }
    } else {
//        document.getElementById("alterBtn").style.background = "gray";
        document.getElementById("alterArea").style.display = "none";
        alert("修改次数已用完，请明日再试");
    }
}

function logout() {
    document.getElementById("adminLogout").style.display = 'none';
    document.getElementById("loginArea").style.display = 'none';
    document.getElementById("adminLogin").style.display = 'block';
    document.getElementById("alterArea").style.display = 'none';
    hideAnswers();
}

function register() {
    if (confirm("确定要重新注册吗？")) {
        var storage = window.localStorage;
        var today = getDateTime()[1];
        storage.clear();
        storage.setItem("123", "123");
        if (storage.getItem("date") === null) {//初始化，只执行一次
            storage.setItem("date", today);
            storage.setItem("alterTimes", 0);
        }
        alert("重新注册成功，初始ID为：123，初始密码为：123");
        logout();
    }
}

//导入CSV

function showImportArea() {
    var is_show = document.getElementById("importCsvArea").style.display;
    if (is_show === "none") {
        document.getElementById("importCsvArea").style.display = "block";
    } else {
        document.getElementById("importCsvArea").style.display = "none";
    }
}

function analCsv() {//解析csv文件
    var csvFile = document.getElementById("csvFile");
    if (csvFile.value !== "") {
        var reader = new FileReader();
        reader.readAsText(csvFile.files[0]);
        reader.onload = function () {
            var resArr = this.result.split(";");
            var outputarea = document.getElementById("outputarea");
            var eTableHeader = "<table id='answerTable' class='table table-bordered table-striped table-hover' style='text-align: center; font-weight: bold;'>";
            var eTableBody = "<tr><th>序号</th><th>算式</th><th>结果</th><th id='thResult' style='display:none'>答案</th></tr>";
            for (var i = 0; i < resArr.length; i++) {//将算式作为table的一行循环输出
                var equationArr = resArr[i].split(",");
                var equationBody = equationArr[0];
                var result = equationArr[1];
                eTableBody += "<tr class='' id='eTableBodyTr" + (i + 1) + "'" + "><td>" + (i + 1) + "</td><td>" + equationBody + "</td><td><input id='userAnswer" + (i + 1) + "'" + " class='form-control' type='text' placeholder='answer'/></td><td id='tdResult" + i + "' style='display:none'>" + result + "</td></tr>"; //动态地为table的每一行添加一个id，动态地为每一行中需要用户输入的input标签添加一个id，并将算式答案隐藏在每一行的第四列
            }
            var eTableFooter = "</table>";
            var eTable = eTableHeader + eTableBody + eTableFooter;
            outputarea.innerHTML = eTable;
            document.getElementById("upBtn").innerHTML = "<a href='#top'><image src='image/up.jpg' style='height: 50px; width: 50px'/></a>"; //添加快速返回顶部的按钮
            document.getElementById("footer").innerHTML = "<p class='text-info'>-----------------------------------------------------------  到底啦  -----------------------------------------------------------</p>"; //在页面底部添加“到底啦”提示
            showImportArea();

            //显示来自导入的文件
            var fileName = csvFile.files[0].name;
            document.getElementById("isImport").innerHTML = "以下习题来自文件 " + fileName + "<br/>";
            document.getElementById("csvFile").value = "";
        };
    } else {
        alert("请先选择导入文件！");
    }
}
