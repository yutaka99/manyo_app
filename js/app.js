// js/app.js

// カメラのストリームを管理する変数
let videoStream = null;

function renderApp() {
    const hash = window.location.hash.substring(1);
    const appContainer = document.getElementById('app');
    
    // 1. ホーム画面（ハッシュがない、またはカメラモードの場合）
    if (!hash || hash === 'camera' || !plantDatabase[hash]) {
        
        if (hash === 'camera') {
            // 【新機能】ARカメラモードのテンプレート
            appContainer.innerHTML = `
                <div class="message-box" style="border-style: solid;">
                    <h2 style="color: #ffd700; margin-top: 0;">万葉の窓</h2>
                    <p style="font-size: 1.0rem; margin-bottom: 15px;">QRコードを読み取って下さい。</p>
                    
                    <div style="position: relative; width: 100%; height: 280px; background: #222; border-radius: 8px; overflow: hidden; margin-bottom: 15px;">
                        <video id="camera-preview" autoplay playsinline style="width: 100%; height: 100%; object-fit: cover;"></video>
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); border: 2px dashed #ffd700; width: 80%; height: 60%; pointer-events: none; opacity: 0.6;"></div>
                    </div>
                    
                    <button onclick="stopCamera()" class="nav-btn" style="width: 60%; min-height: 40px; background:#111;">カメラを閉じる</button>
                </div>
            `;
            // 画面構築後にカメラを起動
            startCamera();
        } else {
            // 通常のホーム画面
            stopCamera();
            appContainer.innerHTML = `
                <div class="message-box">
                    <h2 style="color: #ffd700; margin-top: 0;">万葉の窓</h2>
                    <p style="font-size: 1.2rem;">園内の木札にあるQRコードをスマートフォンで読み取ると、ここに解説がに表示されます。</p>
                    <p style="font-size: 0.9rem; color: #888888;">（一度読み込めば、奥地の電波がない場所でも動きます）</p>
                </div>
            `;
        }
        return;
    }

    // 2. 植物解説画面（ハッシュが植物IDの場合）
    stopCamera();
    const data = plantDatabase[hash];
    
    appContainer.innerHTML = `
        <h1 class="plant-name">${data.name}</h1>
        
        <div class="waka-section">
            <p class="section-title" style="margin-top:0; color:#aaaaaa;">【万葉集の歌】</p>
            <p class="waka-text">${data.waka}</p>
            <p class="waka-yomi">${data.yomi}</p>
        </div>

        <p class="section-title">【現代語訳】</p>
        <p class="text-block">${data.translation}</p>

        <p class="section-title">【植物と歴史の解説】</p>
        <p class="text-block">${data.description}</p>
    `;
    window.scrollTo(0, 0);
}

// 【新機能】カメラを起動する関数
async function startCamera() {
    const video = document.getElementById('camera-preview');
    if (!video) return;

    const constraints = {
        video: {
            facingMode: 'environment', // スマホの「背面（アウト）カメラ」を優先指定
            width: { ideal: 1280 },
            height: { ideal: 720 }
        },
        audio: false // 音声は不要
    };

    try {
        // ブラウザにカメラの権限をリクエストしてストリームを取得
        videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = videoStream;
    } catch (err) {
        console.error("カメラの起動に失敗しました: ", err);
        video.parentElement.innerHTML = `
            <div style="padding: 40px 10px; color: #ff4444; font-size: 0.9rem;">
                カメラへのアクセスが拒否されたか、対応していません。<br>ブラウザの設定でカメラ権限を許可してください。
            </div>
        `;
    }
}

// 【新機能】カメラを停止してバッテリー消費を抑える関数
function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
}

// イベントリスナーの登録
window.addEventListener('hashchange', renderApp);
window.addEventListener('DOMContentLoaded', renderApp);