
'use strict';

// boardキャンバスの大きさ
const OUTLINE = 600;
// １マスの１辺の長さ
const SQUARE_SIDE_LENGTH = OUTLINE / 6;

let canvas = document.getElementById('board');
let ctx = canvas.getContext('2d');


// ボードに区切り線を描画
window.addEventListener('DOMContentLoaded', drawBoardFrame);
/*
function drawBoardFrame() {

  // 描画開始地点のXY座標を指定
  const START_X = OUTLINE / 12;
  const START_Y = START_X;
  ctx.translate(START_X, START_Y);

  // 描画プロパティ
  const n = 5;
  const FRAME_LINE_LENGTH = SQUARE_SIDE_LENGTH / 2 - n;
  ctx.lineWidth = n;
  ctx.lineCap = 'square';

  // x座標 0〜5、y座標 0〜5
  var points_x = [
    0,
    SQUARE_SIDE_LENGTH,
    SQUARE_SIDE_LENGTH * 2,
    SQUARE_SIDE_LENGTH * 3,
    SQUARE_SIDE_LENGTH * 4,
    SQUARE_SIDE_LENGTH * 5
  ];
  var points_y = points_x;

  // １ループ：正方形の横線
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 6; j++) {
      ctx.beginPath();
      ctx.moveTo(points_x[i], points_y[j]);
      ctx.lineTo(points_x[i] + FRAME_LINE_LENGTH, points_y[j]);
      ctx.moveTo(points_x[i + 1] - FRAME_LINE_LENGTH, points_y[j]);
      ctx.lineTo(points_x[i + 1], points_y[j]);
      ctx.stroke();
    }
  }

  // １ループ：正方形の縦線
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 6; j++) {
      ctx.beginPath();
      ctx.moveTo(points_x[j], points_y[i]);
      ctx.lineTo(points_x[j], points_y[i] + FRAME_LINE_LENGTH);
      ctx.moveTo(points_x[j], points_y[i + 1] - FRAME_LINE_LENGTH);
      ctx.lineTo(points_x[j], points_y[i + 1]);
      ctx.stroke();
    }
  }

  // 描画開始地点を元に戻す
  ctx.translate(-START_X, -START_Y);
}
*/

// *****************************************
// 25マスそれぞれに対して、描画を担当する関数
// *****************************************
// $1, コマの種類
// $2, 列
// $3, 行
function drawPiece(pieceType, col, row){

  // 描画の中心地点を決定
  let center_x = SQUARE_SIDE_LENGTH * col;
  let center_y = SQUARE_SIDE_LENGTH * row;
  let radius = 40;
  let startAngle = 0;
  let endAngle = Math.PI * 2;

  // コマの種類から描画プロパティを決定
  switch(pieceType){
    case 0:
      return;
    case 1:
      ctx.fillStyle = "rgba(128,0,0,0.5)";
      break;
    case 2:
      ctx.fillStyle = "rgba(0,0,128,0.5)";
      break;
    case 3:
      ctx.fillStyle = "rgba(128,0,128,0.8)";
      break;
    default:
      console.log(`コマの指定が不正です。:${pieceType}`)
  }

  // 円を描画
  ctx.beginPath();
  ctx.arc(center_x, center_y, radius, startAngle, endAngle);
  ctx.fill();
}

// ボードのステータス
let boardState = [
  1,1,1,1,1,
  0,0,0,0,0,
  0,0,3,0,0,
  0,0,0,0,0,
  2,2,2,2,2
];

// ボードのステータスを変更
function updateBoardPiece(pieceType, col, row){
  // 変数 boardState のインデックスを取得
  let index = 5 * (row - 1) + (col - 1);
  boardState[index] = pieceType;
}

// コマを再描画
function drawPieces(){

  // ボードのステータスからコマを描画
  boardState.forEach((el, index) => {
    let col = index % 5 + 1;
    let row = Math.floor(index / 5) + 1;
    drawPiece(el, col, row);

    // console.log(`el: ${el}`);
    // console.log(`col:${col}`);
    // console.log(`row:${row}`);
    // console.log(`index:${index}`);  
  })

}

// 現在配置されているコマを全て削除
function clearBoard(){
  ctx.clearRect(0,0,canvas.width, canvas.height);
  drawBoardFrame();
}

// 再描画
function reRenderPieces(){
  clearBoard();
  drawPieces();
}

// ボード操作に関する処理をまとめる
class BoardController {
  constructor(board, ctx){
    this.board = board;
    this.ctx = ctx;
    this.boardState = [
      1,1,1,1,1,
      0,0,0,0,0,
      0,0,3,0,0,
      0,0,0,0,0,
      2,2,2,2,2
    ];
  }

  drawBoardFrame = function() {

    // 描画開始地点のXY座標を指定
    const START_X = OUTLINE / 12;
    const START_Y = START_X;
    this.ctx.translate(START_X, START_Y);
  
    // 描画プロパティ
    const n = 5;
    const FRAME_LINE_LENGTH = SQUARE_SIDE_LENGTH / 2 - n;
    this.ctx.lineWidth = n;
    this.ctx.lineCap = 'square';
  
    // x座標 0〜5、y座標 0〜5
    let points_x = [
      0,
      SQUARE_SIDE_LENGTH,
      SQUARE_SIDE_LENGTH * 2,
      SQUARE_SIDE_LENGTH * 3,
      SQUARE_SIDE_LENGTH * 4,
      SQUARE_SIDE_LENGTH * 5
    ];
    let points_y = points_x;
  
    // １ループ：正方形の横線
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 6; j++) {
        this.ctx.beginPath();
        this.ctx.moveTo(points_x[i], points_y[j]);
        this.ctx.lineTo(points_x[i] + FRAME_LINE_LENGTH, points_y[j]);
        this.ctx.moveTo(points_x[i + 1] - FRAME_LINE_LENGTH, points_y[j]);
        this.ctx.lineTo(points_x[i + 1], points_y[j]);
        this.ctx.stroke();
      }
    }
  
    // １ループ：正方形の縦線
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 6; j++) {
        this.ctx.beginPath();
        this.ctx.moveTo(points_x[j], points_y[i]);
        this.ctx.lineTo(points_x[j], points_y[i] + FRAME_LINE_LENGTH);
        this.ctx.moveTo(points_x[j], points_y[i + 1] - FRAME_LINE_LENGTH);
        this.ctx.lineTo(points_x[j], points_y[i + 1]);
        this.ctx.stroke();
      }
    }
  
    // 描画開始地点を元に戻す
    this.ctx.translate(-START_X, -START_Y);
  }
  
  // *****************************************
  // 25マスそれぞれに対して、描画を担当する関数
  // *****************************************
  // $1, コマの種類
  // $2, 列
  // $3, 行
  drawPiece = function(pieceType, col, row){

    // 描画の中心地点を決定
    let center_x = SQUARE_SIDE_LENGTH * col;
    let center_y = SQUARE_SIDE_LENGTH * row;
    let radius = 40;
    let startAngle = 0;
    let endAngle = Math.PI * 2;
  
    // コマの種類から描画プロパティを決定
    switch(pieceType){
      case 0:
        return;
      case 1:
        this.ctx.fillStyle = "rgba(128,0,0,0.5)";
        break;
      case 2:
        this.ctx.fillStyle = "rgba(0,0,128,0.5)";
        break;
      case 3:
        this.ctx.fillStyle = "rgba(128,0,128,0.8)";
        break;
      default:
        console.log(`コマの指定が不正です。:${pieceType}`)
    }
  
    // 円を描画
    this.ctx.beginPath();
    this.ctx.arc(center_x, center_y, radius, startAngle, endAngle);
    this.ctx.fill();
  }

  // ボードのステータスを変更
  updateBoardPiece = function(pieceType, col, row){
    // 変数 boardState のインデックスを取得
    let index = 5 * (row - 1) + (col - 1);
    this.boardState[index] = pieceType;
  }

  // コマを再描画
  drawPieces = function(){
    // ボードのステータスからコマを描画
    this.boardState.forEach((el, index) => {
      let col = index % 5 + 1;
      let row = Math.floor(index / 5) + 1;
      drawPiece(el, col, row);
    })
  }

  // 現在配置されているコマを全て削除
  clearBoard = function(){
    this.ctx.clearRect(0,0,canvas.width, canvas.height);
    drawBoardFrame();
  }

  // 再描画
  reRenderPieces = function(){
    clearBoard();
    drawPieces();
  }

}

let boardContoller = new BoardController(canvas, ctx);


// 課題：
  // 課題：Canvasの一部をクリック ⇨ クリック時の座標を取得して console.logに出力
  // 課題：Canvasのクリック座標から、col, row, を計算してconsole.log
  // 課題：col,row,の値から配列のindexを取得してconsole.log
  // 課題：
// 




/*
 * 実装方式（仮）
 * ボード-> id: board, tag: canvas 
 * コマ ->  class: piece white black pitfall を合わせる感じで
 * 
 * 
 * 
 */





/*
  // コマcanvas 作成
  const pieceIDs = ['piece_w1', 'piece_w2', 'piece_w3', 'piece_w4', 'piece_w5'];
  let pieces = [];
  pieceIDs.forEach(function(id){
  const canvas = document.createElement(id);
  canvas.width = 80;
  canvas.height = 80;
  const ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.fillStyle = "purple";
  // 40, 40 -> 中心点
  // 40 -> 半径
  // 0, Math.PI * 2 -> 0 〜 360 度まで -> 円
  ctx.arc(40, 40, 40, 0, Math.PI * 2);
  ctx.fill();

  // 配列に追加
  pieces.push(canvas);
 });

 console.log(pieces[0]);
*/

/*
// 素のJavaScriptでただ描くだけのパターン
window.onload = function () {

  // ================================================================
  // ５つのコマを作成 - darkblue
  const piece_w1 = document.createElement('canvas');
  const piece_w2 = document.createElement('canvas');
  const piece_w3 = document.createElement('canvas');
  const piece_w4 = document.createElement('canvas');
  const piece_w5 = document.createElement('canvas');
  let pieces = [piece_w1, piece_w2, piece_w3, piece_w4, piece_w5];
  pieces.forEach(function(piece){
    piece.width = 80;
    piece.height = 80;
    let ctx = piece.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = "darkblue";
    // 40, 40 -> 中心点
    // 40 -> 半径
    // 0, Math.PI * 2 -> 0 〜 360 度まで -> 円
    ctx.arc(40, 40, 40, 0, Math.PI * 2);
    ctx.fill();
    //console.log(piece);
  });
  // ================================================================
  // 区切り線を描画 - プロパティを宣言
  let canvas = document.getElementById('board');
  let ctx = canvas.getContext('2d'); //描画コンテキスト取得
  const outline = 600;
  const rect_length = outline / 6;
  const start_x = outline / 12;
  const start_y = start_x;
  // 左上の角を開始座標に設置
  ctx.translate(start_x, start_y);      
  
  // コンテキストのプロパティのデフォルト状態を保存
  // [注意] translate プロパティは初期状態に戻せない
  ctx.save();

  // ==============================================================
  // ５つのコマcanvasを、土台canvasに配置
  for(let i=0; i<5; i++){
    const img = new this.Image();
    img.src = pieces[i].toDataURL();
    ctx.drawImage(img, 10 + 100 * i, 210);
  }
  // ==============================================================

}
*/


