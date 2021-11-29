//все файлы подключаем сюда
import "./../css/style.scss";
import "./../index.html";

let val1 = document.getElementById("range1");
val1.oninput = function () {
  let aa = document.getElementById("item1");
  aa.value = "От" + " " + val1.value;
};

let val2 = document.getElementById("range2");
val2.oninput = function () {
  let aa = document.getElementById("item2");
  aa.value = "До" + " " + val2.value;
};
