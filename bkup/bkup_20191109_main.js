
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
  // ==============================================================
  // ５つのコマcanvasを、土台canvasに配置
  for(i=0; i<5; i++){
    const img = new this.Image();
    img.src = pieces[i].toDataURL();
    ctx.drawImage(img, 10 + 100 * i, 210);
  }
  // ==============================================================



/*
  // コマの描画：左上
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
  */

  // Canvasを合成する
  /*
   * @param (string) base  -> 合成結果を描画するcanvas(id)
   * @param (string) asset -> 合成する素材canvas(id)
   * @param (int) x -> 描画開始位置：x
   * @param (int) y -> 描画開始位置：y
   */
  /*
  async function concatCanvas(base, asset, x, y){
    const canvas = document.querySelector(base);
    const ctx = canvas.getContext('2d');

    for(let i=0; i<asset.length; i++){
      const image1 = await getImageFromCanvas(asset);
      ctx.drawImage(image1, x, y);
    }
  }
  */

  /*
   * Canvasを画像として取得
   * 
   * @param  {string} id 対象objectのid
   * @return {object}
   */

   /*
  function getImageFromCanvas(){
    return new Promise((resolve, reject) => {
      const image = new Image();
      const ctx = document.querySelector(id).getContext('2d');
      image.onload = () => resolve(image);
      image.onerror = (e) => reject(e);
      image.src = ctx.canvas.toDataURL();
    });
  }
  */

/*
  // コマを描く２＿別canvas
  (function(){
    const piece = document.createElement('canvas');
    const pCtx = piece.getContext('2d');
    piece.width = 80;
    piece.height = 80;

    // 開始座標
    const start_x = 40;
    const start_y = 40;
    const radius = 40; // 半径
    const startAngle = 0;
    const endAngle = Math.PI * 2;

    pCtx.beginPath();
    pCtx.fillStyle = "purple";
    pCtx.arc(start_x, start_y, radius, startAngle, endAngle);
    pCtx.fill();

    // concatCanvas("#board", "#canvas", 210, 210);

    const image1 = new Image();
    image1.src = piece.toDataURL();

    // ベースに追加
    ctx.drawImage(image1, 110, 110);
  })();
*/

}


