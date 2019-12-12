
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
const MOVE_TOP = -7;
const MOVE_DOWN = 7;
const MOVE_RIGHT = 1;
const MOVE_LEFT = -1;

// コマの描画プロパティ
const PLAYER1_STYLE = "rgba(128,0,0,1)";
const PLAYER2_STYLE = "rgba(0,0,128,1)";
const PITFALL_STYLE = "rgba(128,0,128,0.8)";

// ボード操作に関する処理を行うクラス
class BoardController {
  constructor(board, ctx) {
    this.board = board;
    this.ctx = ctx;
    this.index = null;
    // ここが trueの間はイベントを受け付けない
    this.eventNGFlag = false;
    this.pieces = [
      { id: 1,  type: 1, index: 8,  nextIndex: null },
      { id: 2,  type: 1, index: 9,  nextIndex: null },
      { id: 3,  type: 1, index: 10,  nextIndex: null },
      { id: 4,  type: 1, index: 11,  nextIndex: null },
      { id: 5,  type: 1, index: 12,  nextIndex: null },
      { id: 6,  type: 2, index: 36, nextIndex: null },
      { id: 7,  type: 2, index: 37, nextIndex: null },
      { id: 8,  type: 2, index: 38, nextIndex: null },
      { id: 9,  type: 2, index: 39, nextIndex: null },
      { id: 10, type: 2, index: 40, nextIndex: null },
      { id: 11, type: 3, index: 24, nextIndex: null },
    ]

  }

  // インデックスを取得
  getIndex = function (col, row) {return row * 7 + col;}

  // インデックスから行、列を取得
  getCol = function(index){ return index % 7; }
  getRow = function(index){ return Math.floor(index / 7); }

  // 場外判定
  isOver = function (index, moveDirection) {
    let nextIndex = index + moveDirection;
    let col = this.getCol(nextIndex);
    let row = this.getRow(nextIndex);
    if(col == 0 || col == 6 || row == 0 || row == 6) return true;

    return false;
  }

  // 移動するコマをセット
  setterIndex = function (index) {
    // index が場外ではないことを確認
    if (this.isOver(index, 0)) return false;

    // indexにコマがあることを確認
    if(!this.pieces.find(el => el.index == index)) return false;

    // index にセット
    this.index = index;
    return true;
  }

  // ボードに区切り線を描画
  drawBoardFrame = function () {

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

  // 描画を担当
  drawPiece = function (obj) {

    let pieceType = obj.type;
    let col = obj.col;
    let row = obj.row;

    // 描画の中心地点を決定 - 円
    let center_x = SQUARE_SIDE_LENGTH * col;
    let center_y = SQUARE_SIDE_LENGTH * row;
    let radius = 40;
    let startAngle = 0;
    let endAngle = Math.PI * 2;

    // 描画の開始地点を決定 - 四角形
    let start_x = center_x - 40;
    let start_y = center_y - 40;

    // コマの種類から描画プロパティを決定
    switch (pieceType) {
      case 0:
        return;
      case 1:
        this.ctx.fillStyle = PLAYER1_STYLE;
        // 四角形コマを描画
        this.ctx.fillRect(start_x, start_y, 80,80);
        break;
      case 2:
        this.ctx.fillStyle = PLAYER2_STYLE;
        // 四角形コマを描画
        this.ctx.fillRect(start_x, start_y, 80,80);
        break;
      case 3:
        this.ctx.fillStyle = PITFALL_STYLE;
        // 円のコマを描画
        this.ctx.beginPath();
        this.ctx.arc(center_x, center_y, radius, startAngle, endAngle);
        this.ctx.fill();
        break;
      default:
        console.log(`コマの指定が不正です。:${pieceType}`)
    }
  }


  // 現在配置されているコマを全て削除
  clearBoard = function () {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawBoardFrame();
  }


  // 指定されたindexからコマの種類を取得
  getPieceType = function(index){
    let nextPieceID = this.boardState[this.index + moveDirection];
    return this.pieces[`${nextPieceID-1}`].pieceType;
  }

  // 指定されたマスのコマを移動する。移動不可能な場合は false を返す。
  movePiece = function (moveDirection) {
    // index が選択されていることを確認
    if (!this.index) return false;

    // indexのコマのID、種類
    let currentPiece = this.pieces.find(el => el.index == this.index);
    // indexに指定された場所にコマがない場合、falseを返す - 本来生じないはず
    if(!currentPiece) return false;


    // 移動先のコマのオブジェクト
    let nextPiece = this.pieces.find(el => el.index == this.index + moveDirection);
    

    // indexを確認
    // console.log(`移動対象のコマ（index）:${this.index}`);
    // console.log(`移動先のインデックス：${this.index + moveDirection}`);
    // console.log(`移動先のコマ：${nextPiece}`);

    // 指定されたマスにあるコマの種類によって、挙動を変更
    switch (currentPiece.type) {
      // 落とし穴の場合
      case PITFALL:
        if (this.isOver(this.index, moveDirection)) {
          console.log('落とし穴コマを場外に動かすことはできません。')
          return false;
        }
        if (nextPiece != undefined) {
          console.log(`nextPieceType:${nextPiece.type}`);
          console.log('移動先にプレイヤーのコマがある場合、落とし穴コマを移動することはできません。');
          return false;
        }

        // 落とし穴コマの「次の移動先」を指定し、trueを返す
        currentPiece.nextIndex = this.index + moveDirection;
        return true;

      // コマの場合 ※２つのcaseを同列に扱っているのは意図に沿っている
      case PLAYER1:
      case PLAYER2:
        // 移動先が「場外」の場合
        if(this.isOver(this.index, moveDirection)){
          console.log('移動先：場外');
          currentPiece.nextIndex = this.index + moveDirection;
          return true;
        }

        // 移動先のコマが存在する && 移動先のコマが「落とし穴」 → コマのnextIndexを操作して終了
        if (nextPiece && nextPiece.type == PITFALL) {
          currentPiece.nextIndex = this.index + moveDirection;
          return true;
        }

        // 移動先のコマが存在する && 落とし穴以外のコマ → 移動先を先に移動させる
        if (nextPiece) {
          // 移動先のコマを「移動対象」に指定
          this.setterIndex(this.index + moveDirection);
          this.movePiece(moveDirection);

          // indexを元に戻す
          this.setterIndex(this.index - moveDirection);
        }

        // 移動先にコマを移動させる
        currentPiece.nextIndex = this.index + moveDirection;

        break;
    }
  }

  // 移動していないコマの nextIndexを埋める
  setNextIndex = function(){
    this.pieces.forEach(el => {
      if(!el.nextIndex) el.nextIndex = el.index;
    })
  }

  // 移動アニメーションが終了したあと、nextIndexの値をindexに上書きし、nextIndexを空にする
  clearNextIndex = function(){
    this.pieces.forEach(el => {
      el.index = el.nextIndex;
      el.nextIndex = null;
    })
  }

  // 移動アニメーション終了後、コマの生存条件を見直し、再描画する
  reRenderPieces = function(){
    // 落とし穴にハマったコマのindexを nullにする
    let pitfallIndex = this.pieces.find(el => el.type == PITFALL).index;
    let inPitfallPiece = this.pieces.filter(el => el.type != PITFALL).find(el => el.index == pitfallIndex);
    if(inPitfallPiece) { inPitfallPiece.index = null; }

    // 場外のコマを index にする
    this.pieces.forEach(el => {
      if(this.isOver(el.index, 0)) el.index = null;
    })
    
    // 現在のindex にしたがって再描画する
    this.pieces.filter(el => el.index != null).forEach(el => {
      let col = this.getCol(el.index);
      let row = this.getRow(el.index);
      let obj = {type: el.type, col: col, row: row};
      this.drawPiece(obj);
    })

  }

  // 移動前、移動後のデータをもとに描画する
  renderAnimation = function(){
    let renderContents = [];
    for(let i=0;i<11;i++){
      renderContents[i] = [];
    }
    
    // コマごとに行,列,その差分の値を取得し、10分の1刻みで分割する
    this.pieces.filter(el => el.index != null).forEach(el => {
      let currentRow = this.getRow(el.index);
      let currentCol = this.getCol(el.index);
      let diffRow = this.getRow(el.nextIndex) - currentRow;
      let diffCol = this.getCol(el.nextIndex) - currentCol;
      for(let i=0;i<11;i++){
        renderContents[i].push({type: el.type, row: currentRow + diffRow * i / 10, col: currentCol + diffCol * i / 10});
      }
    })
    // console.log(renderContents);

    // 100ms ごとに１つずつ描画
    for(let i=0;i<11;i++){
      setTimeout(() => {
        this.clearBoard();
        renderContents[i].forEach(el => this.drawPiece(el));
      }, 50 * i)
    }

  }
}

let boardContoller = new BoardController(canvas, ctx);

// ボードに区切り線を描画
boardContoller.drawBoardFrame();

// クリックイベントを登録
canvas.onclick = function (e) {
  let rect = e.target.getBoundingClientRect();
  // クリック座標を取得＋開始位置を引く
  let mouseX = e.clientX - Math.floor(rect.left) - START_X;
  let mouseY = e.clientY - Math.floor(rect.top)  - START_Y;

  // 列、行を取得
  let col = Math.floor(mouseX / SQUARE_SIDE_LENGTH) + 1;
  let row = Math.floor(mouseY / SQUARE_SIDE_LENGTH) + 1;

  // インデックスを登録
  let index = boardContoller.getIndex(col, row);
  if (boardContoller.setterIndex(index)) {
    console.log(`コマを選択しました。index:${index}`);
  }

  // 場外の場合は何もしない
  if(boardContoller.isOver(index, 0)) return false;

  // コマがない場合も何もしない
  if(!boardContoller.pieces.find(el => el.index == index)) return false;

  // 一度コマを再描画してから、選択していることを表示するカゲを描写する
  boardContoller.clearBoard();
  boardContoller.reRenderPieces();
  let start_x = col * SQUARE_SIDE_LENGTH - SQUARE_SIDE_LENGTH / 2;
  let start_y = row * SQUARE_SIDE_LENGTH - SQUARE_SIDE_LENGTH / 2;
  ctx.fillStyle = "rgba(221,160,221,0.8)";
  ctx.fillRect(start_x, start_y, SQUARE_SIDE_LENGTH, SQUARE_SIDE_LENGTH);

}

// 方向キーのイベントを登録_移動方向を選択
document.body.addEventListener('keydown', function (e) {
  // 移動対象のコマが選択されていることを確認
  if (!boardContoller.index) return false;

  // イベントNGフラグが立っていないことを確認
  if(boardContoller.eventNGFlag) return false;
  boardContoller.eventNGFlag = true;

  // 方向キーによって、移動方向を選択
  let moveDirection = null;
  switch (e.keyCode) {
    case 37:
      // console.log('37_左');
      moveDirection = MOVE_LEFT;
      break;
    case 38:
      // console.log('38_上');
      moveDirection = MOVE_TOP;
      break;
    case 39:
      // console.log('39_右');
      moveDirection = MOVE_RIGHT;
      break;
    case 40:
      // console.log('40_下');
      moveDirection = MOVE_DOWN;
      break;
    default:
      // console.log('このキーは無効です。');
      return false;
  }

  // コマを移動して再描画する
  // console.log('コマを移動します。');
  boardContoller.movePiece(moveDirection);
  boardContoller.setNextIndex();
  boardContoller.renderAnimation();
  setTimeout(() => {
    boardContoller.clearNextIndex();
    boardContoller.clearBoard();
    boardContoller.reRenderPieces();
    boardContoller.eventNGFlag = false;
  },600)


})

boardContoller.reRenderPieces();


