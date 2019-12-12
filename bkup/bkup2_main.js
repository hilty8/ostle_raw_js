
/*
function init (){
  var stage = new createjs.stage("demoCanvas");
  var circle = new createjs.Shape();
  circle.graphics.beginFill("DeepSkyBlue").drawCircle(0,0,50);
  circle.x = 100;
  circle.y = 100;
  stage.addChild(circle);
  stage.update();
}
*/

// 素のJavaScriptでただ描くだけのパターン
window.addEventListener('load', init);
function init(){
  var canvas = document.getElementById('board');
  var ctx = canvas.getContext('2d'); //描画コンテキスト取得
  const outline = 600;
  const rect_length = outline / 6;
  const start_x = outline / 12;
  const start_y = start_x;
  // 左上の角を開始座標に設置
  ctx.translate(start_x, start_y);

  // コンテキストのプロパティのデフォルト状態を保存
  // [注意] translate プロパティは初期状態に戻せない
  ctx.save();


  // 区切り線を描画
  (function(){
    // 操作したプロパティを戻す
    ctx.restore();

    // 描画プロパティ
    const n = 5;
    const line_length = rect_length / 2 - n;
    ctx.lineWidth = n;
    ctx.lineCap = 'square';

    // x座標 0〜5、y座標 0〜5
    var points_x = [
      0,
      rect_length,
      rect_length * 2,
      rect_length * 3,
      rect_length * 4,
      rect_length * 5
    ];
    var points_y = points_x;

    // １ループ：正方形の横線
    for (i=0; i<5; i++){
      for(j=0; j<6; j++){
        ctx.beginPath();
        ctx.moveTo(points_x[i], points_y[j]);
        ctx.lineTo(points_x[i] + line_length, points_y[j]);
        ctx.moveTo(points_x[i+1] - line_length, points_y[j]);
        ctx.lineTo(points_x[i+1], points_y[j]);
        ctx.stroke();
      }
    }

    // １ループ：正方形の縦線
    for (i=0; i<5; i++){
      for(j=0; j<6; j++){
        ctx.beginPath();
        ctx.moveTo(points_x[j], points_y[i]);
        ctx.lineTo(points_x[j], points_y[i] + line_length);
        ctx.moveTo(points_x[j], points_y[i+1] - line_length);
        ctx.lineTo(points_x[j], points_y[i+1]);
        ctx.stroke();
      }
    }


  })();

  // コマを描いてみる
  (function(){

    // 操作したプロパティを戻す
    ctx.restore();

    // コマの色
    ctx.fillStyle = "purple";

    const start_x = rect_length / 2;
    const start_y = rect_length / 2;

    var radius = 40;
    var startAngle = 0;
    var endAngle = Math.PI * 2;

    ctx.beginPath();
    ctx.arc(start_x, start_y, radius, startAngle, endAngle);
    ctx.fill();
  })();

}

// createjs の実験
window.addEventListener('load', try1);
function try1(){
  var stage = new createjs.Stage("board");
  var shape = new createjs.Shape();
  shape.graphics.beginFill("DarkRed");
  shape.graphics.drawCircle(0,0,50);
  shape.x = 100;
  shape.y = 100;
  stage.addChild(shape);
  stage.isVisible = false;
  stage.update();



}
