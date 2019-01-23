import css from './css/index.css';
import less from './css/black.less';
import scss from './css/white.scss';

import $ from "jquery" // 引用后不管你在代码中使用不用该类库，都会把该类库打包起来


// document.getElementById('title').innerHTML = 'Hello Webpack';

{
    let test = "hello webpack";
    document.getElementById("title").innerHTML = test;

    $("#postcss").text('hellp123');
}