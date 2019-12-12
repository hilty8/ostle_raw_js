
'use strict';

// boardキャンバスの大きさ
const OUTLINE = 600;
// Canvasの描画開始位置
const START_X = OUTLINE / 12;
const START_Y = START_X;

// １マスの１辺の長さ
const SQUARE_SIDE_LENGTH = OUTLINE / 6;

// キャンバスとコンテキストを取得
let canvas = document.getElementById('board');
let ctx = canvas.getContext('2d');

// コマの種類
const PLAYER1 = 1;
const PLAYER2 = 2;
const PITFALL = 3;
const NO_PIECE = 0;

// 移動方向
const MOVE_TOP = -5;
const MOVE_DOWN = 5;
const MOVE_RIGHT = 1;
const MOVE_LEFT = -1;


// ボード操作に関する処理を行うクラス
class BoardController {
  constructor(board, ctx){
    this.board = board;
    this.ctx = ctx;
    this.boardState = [
      1,1,1,1,1,
      0,0,0,0,0,
      0,0,3,0,0,
      0,0,0,2,0,
      2,2,2,2,0
    ];
    this.index = null;
  }

  // インデックスを取得
  getIndex = function(col, row){
    return 5 * (row - 1) + (col - 1);
  }

  // ボードに区切り線を描画
  drawBoardFrame = function() {

    // 描画開始地点のXY座標を指定
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
  
  // 各マスに対して、描画を担当する関数
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
      this.drawPiece(el, col, row);
    })
  }

  // 現在配置されているコマを全て削除
  clearBoard = function(){
    this.ctx.clearRect(0,0,canvas.width, canvas.height);
    this.drawBoardFrame();
  }

  // 再描画
  reRenderPieces = function(){
    this.clearBoard();
    this.drawPieces();
  }

  // 指定されたマスのコマを移動する。移動不可能な場合は false を返す。
  // 移動 上移動:-5, 下移動:+5, 右移動:+1, 左移動:-1
  movePiece = function(moveDirection){
    // index が選択されていることを確認
    if(!this.index) return false;

    // 移動先のコマの種類
    let nextPiece = this.boardState[this.index + moveDirection];

    // indexを確認
    // console.log(`移動対象のコマ（index）:${this.index}`);
    // console.log(`移動先のインデックス：${this.index + moveDirection}`);
    // console.log(`移動先のコマ：${nextPiece}`);

    // 指定されたマスにあるコマの種類によって、挙動を変更
    switch(this.boardState[this.index]){
      // 落とし穴の場合
      case PITFALL:
        // 「移動先が場外」もしくは「移動先にコマがいる」場合」は、移動NG
        if(this.isOver(this.index,moveDirection)) return false;
        if(nextPiece != NO_PIECE) return false;
        
        // 移動先に落とし穴コマを移動し、trueを返す
        this.boardState[this.index + moveDirection] = PITFALL;
        this.boardState[this.index] = NO_PIECE;
        return true;

      // コマの場合 ※２つのcaseを同列に扱っているのは意図に沿っている
      case PLAYER1:
      case PLAYER2:
        // 移動先が「場外」もしくは「落とし穴」の場合 → コマの現在地(index) を「コマなし」に指定
        if(this.isOver(this.index, moveDirection) || nextPiece == PITFALL){
          // console.log('移動先：場外 or 落とし穴');
          this.boardState[this.index] = NO_PIECE;
          return true;
        }

        // 移動先に落とし穴以外のコマがいる場合 → 移動先のコマを先に動かす
        if(nextPiece != NO_PIECE) {
          // 移動先のコマを「移動対象」に指定
          this.setterIndex(this.index + moveDirection);
          this.movePiece(moveDirection);

          // indexを元に戻す
          this.setterIndex(this.index - moveDirection);
        }

        // 移動先にコマを移動させる ＋ 自分の現在地を NO_PIECE に指定
        this.boardState[this.index + moveDirection] = this.boardState[this.index];
        this.boardState[this.index] = NO_PIECE;

        break;

      // コマがない場合 → 移動せずに終了
      case NO_PIECE:
        break;
    }
  }

  // 場外判定
  isOver = function(index, moveDirection){
    if(index + moveDirection < 0 || index + moveDirection > 24) return true;
    return false;
  }

  // 移動するコマをセット
  setterIndex = function(index){
    // index が場外ではないことを確認
    if(this.isOver(index, 0)) return false;
    
    // indexにコマがあることを確認
    if(this.boardState[index] == NO_PIECE) return false;

    // index にセット
    this.index = index;
    return true;
  }


}

let boardContoller = new BoardController(canvas, ctx);

// ボードに区切り線を描画
boardContoller.drawBoardFrame();
boardContoller.reRenderPieces();

// クリックイベントを登録
canvas.onclick = function(e){
  let rect = e.target.getBoundingClientRect();
  // クリック座標を取得＋開始位置を引く
  let mouseX = e.clientX - Math.floor(rect.left) - START_X;
  let mouseY = e.clientY - Math.floor(rect.top)  - START_Y;

  // 列、行を取得
  let col = Math.floor(mouseX / SQUARE_SIDE_LENGTH) + 1;
  let row = Math.floor(mouseY / SQUARE_SIDE_LENGTH) + 1;

  // インデックスを登録
  let index = boardContoller.getIndex(col, row);
  if(boardContoller.setterIndex(index)){
    console.log(`コマを選択しました。index:${index}`);
  }

  // console.log(`mouseX:${mouseX}`);
  // console.log(`mouseY:${mouseY}`);
  // console.log(`col:${col}`);
  // console.log(`row:${row}`);
}

// 方向キーのイベントを登録_移動方向を選択
document.body.addEventListener('keydown', function(e){
  // 移動対象のコマが選択されていることを確認
  if(!boardContoller.index) return false;

  // 方向キーによって、移動方向を選択
  let moveDirection = null;
  switch(e.keyCode){
    case 37:
      console.log('37_左');
      moveDirection = MOVE_LEFT;
      break;
    case 38:
      console.log('38_上');
      moveDirection = MOVE_TOP;
      break;
    case 39:
      console.log('39_右');
      moveDirection = MOVE_RIGHT;
      break;
    case 40:
      console.log('40_下');
      moveDirection = MOVE_DOWN;
      break;
    default:
      // console.log('このキーは無効です。');
      return false;
  }

  // コマを移動して再描画する
  console.log('コマを移動します。');
  boardContoller.movePiece(moveDirection);
  boardContoller.reRenderPieces();

})

// コマオブジェクトを11個作成する
// 移動前、移動後を作成しておき、
// 移動前 + 中間１０個 + 移動後 を描画する形式にしたい
let pieceObj = [
  { pieceID: 1,  pieceType: 1, col: 1, row: 1 },
  { pieceID: 2,  pieceType: 1, col: 2, row: 1 },
  { pieceID: 3,  pieceType: 1, col: 3, row: 1 },
  { pieceID: 4,  pieceType: 1, col: 4, row: 1 },
  { pieceID: 5,  pieceType: 1, col: 5, row: 1 },
  { pieceID: 6,  pieceType: 2, col: 1, row: 5 },
  { pieceID: 7,  pieceType: 2, col: 2, row: 5 },
  { pieceID: 8,  pieceType: 2, col: 3, row: 5 },
  { pieceID: 9,  pieceType: 2, col: 4, row: 5 },
  { pieceID: 10, pieceType: 2, col: 5, row: 5 },
  { pieceID: 11, pieceType: 3, col: 3, row: 3 },
]

class PiecesController {

}

// コマを移動する処理
// 1,1,1,1,1
// 0,0,0,0,0
// 0,0,3,0,0
// 0,0,0,0,0
// 2,2,2,2,2
// 移動するマスを選択、移動方向によって選択する
// index: 22 手前の真ん中のコマ
// 方向：上 そのコマを -5 のインデックスに移動




/*
canvas.addEventListener('click', function(e) {
  let rect = e.target.getBoundingClientRect();
  let mouseX = e.clientX - Math.floor(rect.left);
  
})
*/


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


