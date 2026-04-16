// 1. نظام التنقل بين الصفحات
function changePage(pageId, element) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    element.classList.add('active');
}

// 2. محرك الذكاء الاصطناعي والكاميرا
async function startEngine() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const status = document.getElementById('ai-status');

    status.innerText = "LOADING AI...";

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.play();

        const net = await posenet.load();
        status.innerText = "TRACKING: ON";

        function update() {
            net.estimateSinglePose(video).then(pose => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // رسم النقاط الذكية
                pose.keypoints.forEach(kp => {
                    if (kp.score > 0.5) {
                        ctx.fillStyle = "#00ff88";
                        ctx.beginPath();
                        ctx.arc(kp.position.x, kp.position.y, 5, 0, 2*Math.PI);
                        ctx.fill();
                    }
                });
                requestAnimationFrame(update);
            });
        }
        update();
    } catch (e) {
        alert("Please enable camera access via HTTPS.");
    }
}
