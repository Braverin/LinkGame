// 页面加载后执行主逻辑

// -------------------- 页面加载主函数 --------------------
document.addEventListener("DOMContentLoaded", function () {
    // -------------------- 获取元素 --------------------
    const basicButton = document.getElementById("basicMode");
    const leisureButton = document.getElementById("leisureMode");
    const levelButton = document.getElementById("levelMode");
    const returnButton = document.getElementById("return-btn");
    const startButton = document.getElementById("start-btn");
    const pauseButton = document.getElementById("pause-btn");
    const rankButtion = document.getElementById("rank-btn");

    const helpModel = document.getElementById("helpModel");
    const settingModel = document.getElementById("settingModel");

    const helpButton = document.getElementById("help-btn");
    const settingButton = document.getElementById("setting-btn");
    const closeHelp = document.getElementById("closeHelp");
    const closeSetting = document.getElementById("closeSetting");

    const bgm = new Audio();
    const bgmCheckbox = document.getElementById("bgm-checkbox");
    const volumeControl = document.getElementById("volumeControl");
    const musicSelect = document.getElementById("musicSelect");

    const difficultySelect = document.getElementById("difficultySelect");
    let currentDifficulty = difficultySelect.value;

    const hintButton = document.getElementById("hint-btn");

    const clock = document.getElementById("clock");

    // -------------------- 图片资源 --------------------
     const images = {
        one: "image/one.png",
        two: "image/two.png",
        three: "image/three.png",
        four: "image/four.png",
        five: "image/five.png",
        six: "image/six.png",
        seven: "image/seven.png",
        eight: "image/eight.png",
        nine: "image/nine.png",
        ten: "image/ten.png",
        elven: "image/eleven.png",
        twelve: "image/twelve.png",
        thirteen: "image/thirteen.png",
        fourteen: "image/fourteen.png",
        fifteen: "image/fifteen.png",
        sixteen: "image/sixteen.png",
        seventeen: "image/seventeen.png",
        eighteen: "image/eighteen.png",
        nineteen: "image/nineteen.png"
    };

    // -------------------- 初始化变量 --------------------
    let board = [];
    let score = 0; // 分数
    let isBegin = false; // 是否开始游戏

    // -------------------- 渲染地图 --------------------
    function renderBoard(rows = 10, cols = 16) {
        const boardContainer = document.getElementById("gameBoard");
        boardContainer.innerHTML = "";
        boardContainer.style.gridTemplateColumns = `repeat(${cols}, 48px)`;

        board.forEach((row, i) => {
            row.forEach((imagePath, j) => {
                const cell = document.createElement("div");
                cell.classList.add("game-cell");
                cell.style.backgroundImage = `url(${imagePath})`;
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener("click", handleCellClick);
                boardContainer.appendChild(cell);
            });
        });
    }

    function checkBoardForMatches(){

    }

    function generateBoardByDifficulty(difficulty) {
        let rows, cols;
        // 根据难度设置行列数
        switch (difficulty) {
            case "easy": rows = 6; cols = 6; break;         // 36格
            case "normal": rows = 10; cols = 16; break;     // 160格
            case "difficult": rows = 10; cols = 18; break;  // 180格
            default: rows = 10; cols = 16;
        }
        
        const totalCells = rows * cols; // 总格子数
    
        const pairsNeeded = totalCells / 2; // 需要的图像对数量（每对占2格）
    
        const imageArray = Object.values(images); // 获取所有图像路径
        const imageCount = imageArray.length;
    
        // 创建图片池（每张图像出现偶数次），总量 = totalCells
        let shuffledImages = [];
        let imgIndex = 0;
    
        for (let i = 0; i < pairsNeeded; i++) {
            // 取当前图像路径
            const imagePath = imageArray[imgIndex];
    
            // 每次添加成对的图像
            shuffledImages.push(imagePath);
            shuffledImages.push(imagePath); // 添加一对图像
    
            // 循环使用图像（防止 pairsNeeded > imageCount）
            imgIndex = (imgIndex + 1) % imageCount;
        }
    
        // 随机打乱图像顺序
        shuffledImages.sort(() => Math.random() - 0.5);
    
        // 初始化棋盘（二维数组）
        board = [];
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < cols; j++) {
                board[i][j] = shuffledImages.pop(); // 从打乱后的池中取图像
            }
        }
    
        // 渲染棋盘
        renderBoard(rows, cols);

        //判断是否可以消除
        let canMatch  = false;
        for(let i = 0;i<rows;i++){
            for(let j = 0;j<cols;j++){
                if(board[i][j] !== 0){
                    for(let x = 0;x<rows;x++){
                        for(let y = 0;y<cols;y++){
                            if(board[x][y] !== 0 && (i !== x || j !== y)){
                                const cell1 = { row: i, col: j };
                                const cell2 = { row: x, col: y };
                                if(isSameImage(cell1,cell2)&&canConnect(cell1,cell2)){
                                    canMatch = true;
                                    break;
                                }
                            }
                        }
                        if(canMatch) break;
                    }
                }
                if(canMatch) break;
            }
            if(canMatch) break;
        }
        if(!canMatch){
            for (let i = 0; i < rows; i++) {
                board[i] = [];
                for (let j = 0; j < cols; j++) {
                    board[i][j] = shuffledImages.pop(); // 从打乱后的池中取图像
                }
            }
            renderBoard(rows, cols);
        }

    }
    

    //-------------------- 消子判断逻辑 --------------------

    //-------------------- 一线相连 --------------------
    function isDirectlyConnected(r1,c1,r2,c2){
        if(r1 === r2){
            let [min,max] = [Math.min(c1,c2),Math.max(c1,c2)];
            if (max - min === 1) return true;
            for (let i = min + 1;i<max;i++){
                if( board[r1][i]  !== 0)return false;
            }
            return true;
        }
        if(c1 === c2){
            let[min,max] = [Math.min(r1,r2),Math.max(r1,r2)];
            if (max - min === 1) return true;
            for (let i = min + 1;i<max;i++){
                if(board[i][c1] !== 0)return false;
            }
            return true;
        }
        return false;
    }

    //-------------------- 二线相连 --------------------
    function isOneCornerConnected(r1,c1,r2,c2){
        if (board[r1][c2] === 0 && isDirectlyConnected(r1, c1, r1, c2) && isDirectlyConnected(r1, c2, r2, c2)) {
            return true;
        }
        if (board[r2][c1] === 0 && isDirectlyConnected(r1, c1, r2, c1) && isDirectlyConnected(r2, c1, r2, c2)) {
            return true;
        }
        return false;
    }

    //-------------------- 三线相连 --------------------
    function isTwoCornerConnected(r1, c1, r2, c2) {
        const rowCount = board.length;
        const colCount = board[0].length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                if (board[i][j] !== 0) continue;
                if ((i === r1 && j === c1) || (i === r2 && j === c2)) continue;
    
                if (isOneCornerConnected(r1, c1, i, j) && isDirectlyConnected(i, j, r2, c2)) {
                    return true;
                }
    
                if (isDirectlyConnected(r1, c1, i, j) && isOneCornerConnected(i, j, r2, c2)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    
    //-------------------- 总判断函数 --------------------
    function canConnect(c1, c2) {
        const r1 = c1.row, c1Val = c1.col;
        const r2 = c2.row, c2Val = c2.col;
    
        
        return (isDirectlyConnected(r1, c1Val, r2, c2Val) ||
               isOneCornerConnected(r1, c1Val, r2, c2Val) ||
               isTwoCornerConnected(r1, c1Val, r2, c2Val));
    }


     // -------------------- 游戏通关 --------------------
     function checkGameCompletion(){
        switch(currentDifficulty){
            case"easy":
            if(score === 180){
                winsound.play();
                pauseCountdown();
                isBegin = false;
                Swal.fire({
                    icon: 'success',
                    title: '恭喜你通关了！',
                    text: '你获得了180分！',
                    confirmButtonText: '继续加油！'
                });
            }
            break;
            case"normal":
            if(score === 800){
                winsound.play();
                isBegin = false;
                pauseCountdown();
                Swal.fire({
                    icon: 'success',
                    title: '恭喜你通关了！',
                    text: '你获得了800分！',
                    confirmButtonText: '继续加油！'
                });
            }
            break;
            case"difficult":
            if(score === 950){
                winsound.play();
                isBegin = false;
                pauseCountdown();
                Swal.fire({
                    icon: 'success',
                    title: '恭喜你通关了！',
                    text: '你获得了950分！',
                    confirmButtonText: '继续加油！'
                });
            }
            break;
        }
     }


    // -------------------- 消子算法--------------------
    let selectedCells = [];
    function handleCellClick(e) {
        clickSound.play();
        const cell = e.currentTarget;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if(board[row][col] === 0) return; // 如果已经消除，直接返回

       if (selectedCells.some(c => c.element === cell)) return; // 已经选中，跳过

       cell.classList.add("selected");
        selectedCells.push({ row, col, element: cell });
      
        if(selectedCells.length > 2) {
            const removed = selectedCells.shift();
           removed.element.classList.remove("selected");
        }

        if(selectedCells.length === 2) {
            const cell1 = selectedCells[0];
            const cell2 = selectedCells[1];
            if(isSameImage(cell1, cell2)&&canConnect(cell1,cell2)) {
                matchSound();
                if(!isBegin){
                    isBegin = true;
                    startFlipClockCountdown(); // ✅ 仅此时才真正开始倒计时
                }
                if(selectedMode === "levelMode"){
                    totalTime += 1;
                }else{
                    totalTime += 5; // 每次消除加5秒
                }
                
                updateClockDisplay(totalTime);
                score += 10; // 每次消除加10分
                document.getElementById("score").textContent = `分数：${score}`;
                checkGameCompletion(); // 检查游戏是否完成
                cell1.element.classList.add("matched");
                cell2.element.classList.add("matched");

                board[cell1.row][cell1.col] = 0; // 设置为已消除状态
                board[cell2.row][cell2.col] = 0; // 设置为已消除状态
                setTimeout(() => {
                    cell1.element.innerHTML = "";
                    cell2.element.innerHTML = "";
                    cell1.element.style.backgroundImage = "none";
                    cell2.element.style.backgroundImage = "none";
                    cell1.element.style.backgroundColor = "transparent";
                    cell2.element.style.backgroundColor = "transparent";
                    resetSelectedCells();
                },300);               
            }
        }
    }
    function resetSelectedCells() {
        selectedCells.forEach(c => {
            c.element.classList.remove("selected");
        });
        selectedCells = [];
    }

    function isSameImage(c1, c2) {
        return board[c1.row][c1.col] === board[c2.row][c2.col];
    }


    // -------------------- 翻页倒计时 --------------------
    let totalTime = 300;
    let countdown = null;
    let isPaused = false;
    let level = 1;
    const baseTime = 300;

    function updateClockDisplay(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        flipTo("minuteTens", Math.floor(min / 10));
        flipTo("minuteOnes", min % 10);
        flipTo("secondTens", Math.floor(sec / 10));
        flipTo("secondOnes", sec % 10);
    }

    function flipTo(id, newNumber) {
        const digit = document.getElementById(id);
        if (digit.getAttribute("data-number") !== newNumber.toString()) {
            digit.setAttribute("data-number", newNumber);
            digit.classList.add("flip");
            setTimeout(() => digit.classList.remove("flip"), 500);
        }
    }

    function startFlipClockCountdown() {
        if (countdown || isPaused) return;
        updateClockDisplay(totalTime);
        countdown = setInterval(() => {
            totalTime--;
            if (totalTime <= 0) {
                clearInterval(countdown);
                onCoundownEnd();
                return;
            }
            updateClockDisplay(totalTime);
        }, 1000);
    }

    function pauseCountdown() {
        if (countdown) {
            clearInterval(countdown);
            countdown = null;
            isPaused = true;
        }
    }

    function resetCountdown() {
        if (countdown) {
            clearInterval(countdown);
            countdown = null;
        }
       totalTime = 300;
       updateClockDisplay(totalTime);
    }

    function updateLevelTimer() {
        totalTime = Math.max(60, baseTime - (level - 1) * 30);
        updateClockDisplay(totalTime);
    }

    function onLevelCompleted() {
        level++;
        updateLevelTimer();
        startFlipClockCountdown();
    }

    function onCoundownEnd(){
        loseSound.play();
        setTimeout(() => {
            Swal.fire({
                icon: 'error',
                title: '游戏结束',
                text: '时间到！',
                confirmButtonText: '再来一次！'
            }).then (() => {
                document.getElementById("mainMenu").style.display = "block";
                document.getElementById("gameScreen").style.display = "none";
                totalTime = 300;//重置时间              
            });
        },300);

    }


    // -------------------- 模式控制 --------------------

    let selectedMode = null;
    function gameMode(mode) {
        document.getElementById("mainMenu").style.display = "none";
        document.getElementById("gameScreen").style.display = "block";
        currentDifficulty = "normal";
        difficultySelect.value = currentDifficulty;
        generateBoardByDifficulty(currentDifficulty);
        selectedMode = mode;

        if (mode === "basicMode") {
            clock.style.display = "block";
            hintButton.style.display = "block";
        } else if (mode === "leisureMode") {
            clock.style.display = "none";
            pauseCountdown();
            hintButton.style.display = "block";
        } else if (mode === "levelMode") {
            clock.style.display = "block";
            hintButton.style.display = "block";
            resetCountdown();
            updateLevelTimer();
        }
    }


    // -------------------- 按钮事件绑定 --------------------
    basicButton.addEventListener("click", () => gameMode("basicMode"));
    leisureButton.addEventListener("click", () => gameMode("leisureMode"));
    levelButton.addEventListener("click", () => gameMode("levelMode"));

    returnButton.addEventListener("click", function () {
        isBegin = false;

        clearInterval(countdown);
        countdown = null;
        resetCountdown();

        score = 0;
        document.getElementById("score").textContent = `分数：${score}`;
        
        document.getElementById("mainMenu").style.display = "block";
        document.getElementById("gameScreen").style.display = "none";
    });

    helpButton.addEventListener("click", () => helpModel.style.display = "block");
    closeHelp.addEventListener("click", () => helpModel.style.display = "none");
    settingButton.addEventListener("click", () => {
        settingModel.style.display = "block"
        bgmCheckbox.checked = !bgm.paused;
        musicSelect.value = bgm.src.split("/").pop(); // 获取当前音乐的文件名
    });
    closeSetting.addEventListener("click", () => settingModel.style.display = "none");

    startButton.addEventListener("click", () => {
        if (selectedMode === "basicMode" || selectedMode === "levelMode") {
            isBegin = true;
            isPaused = false;  // 取消暂停状态
            startFlipClockCountdown();  // ✅ 仅此时才真正开始倒计时
        }
    });
    
    pauseButton.addEventListener("click", () => {
        if (selectedMode === "basicMode" || selectedMode === "levelMode") {
            pauseCountdown(); // ✅ 运行暂停逻辑
        }
    });

    rankButtion.addEventListener("click", () => {
        Swal.fire({
            icon: 'info',
            title: '排行榜',
            text: '逗逗你的呀',
            confirmButtonText: '知道了 😊'
        });
    });

    hintButton.addEventListener("click", showHint);


    // -------------------- 音乐控制 --------------------
    const clickSound = new Audio("audio/clicksound.wav");
    const winsound = new Audio("audio/winsound.wav");
    const loseSound = new Audio("audio/losesound.wav");

    function matchSound(){
        const matchSound = new Audio("audio/matchsound.mp3");
        matchSound.play();
    }
    const defaultTrack = "bgm1.mp3"; // 默认音轨
    bgm.src = `audio/${defaultTrack}`; // 设置默认音轨
    bgm.volume = parseFloat(volumeControl.value);// 设置初始音量（默认值为 0.5）
    bgm.loop = true; // 循环播放
   
    // 设置默认选中项（让 select 显示默认音乐）
    musicSelect.value = defaultTrack;

    // ✅ 页面加载完成时自动播放
    window.addEventListener("DOMContentLoaded", function () {
    if (bgmCheckbox.checked) {
        bgm.play(); // 如果打勾，自动播放
    }
});

    // 点击“开启背景音乐”复选框
    bgmCheckbox.addEventListener("change", function () {
        if (this.checked) {
            bgm.play();
        } else {
            bgm.pause();
            bgm.currentTime = 0;
        }
    });

    //切换背景音乐逻辑
    musicSelect.addEventListener("change", function () {
        const selectedTrack = this.value;
        const wasPlaying = !bgm.paused;
        bgm.src = `audio/${selectedTrack}`;
        bgm.load(); // 重新加载音频
        if (wasPlaying&& bgmCheckbox.checked) {
            bgm.play();// 重新播放新音乐
        }
    });

    //调节音量逻辑
    volumeControl.addEventListener("input", function () {
        bgm.volume = parseFloat(this.value);
    });


    // -------------------- 难度切换 --------------------
    difficultySelect.addEventListener("change", function () {
        currentDifficulty = this.value;
        generateBoardByDifficulty(currentDifficulty);
    });


    // -------------------- 提示按钮 --------------------
    let maxHints = 3;// 最大提示次数
    let hintsUsed = 0;// 已使用的提示次数
    hintButton.addEventListener("click", showHint);

    function updateHintUI() {
        const hintCount = document.getElementById("hintCount");
        if(hintCount){
        hintCount.textContent = `提示次数：${maxHints - hintsUsed}`;
        }
    }

    function showHint() {
       
        if(hintsUsed >= maxHints) {
            Swal.fire({
                icon: 'warning',                 // 图标类型：'success' | 'error' | 'warning' | 'info' | 'question'
                title: '提示已用完！',        // 弹窗标题
                text: '你今天已经用完所有提示次数啦，请继续努力消除吧！', // 主体文本
                confirmButtonText: '知道了 😊'  // 按钮文本
            });
            return;
        }

         // 清除之前的提示效果
    document.querySelectorAll('.game-cell.hint').forEach(cell => {
        cell.classList.remove('hint');
    });

        //遍历寻找格子
        for(let i = 0;i<board.length;i++){
            for(let j = 0;j<board[i].length;j++){
                if(board[i][j] === 0)continue;
                for(let x = 0;x<board.length;x++){
                    for(let y = 0;y<board[x].length;y++){
                        const cell11 = { row: i, col: j };
                        const cell22 = { row: x, col: y };
                        if(board[x][y] === 0||(i === x && j === y))continue;
                        if((board[i][j] === board[x][y]) && (canConnect(cell11, cell22))){
                           const cell1 = document.querySelector(`.game-cell[data-row="${i}"][data-col="${j}"]`);
                           const cell2 = document.querySelector(`.game-cell[data-row="${x}"][data-col="${y}"]`);

                            cell1.classList.add('hint');
                            cell2.classList.add('hint');
                            hintsUsed++;
                            updateHintUI();

                            setTimeout(() => {
                                cell1.classList.remove('hint');
                                cell2.classList.remove('hint');
                            },3000);

                            Swal.fire({
                                toast: true,
                                position: 'top-end',
                                icon:'info',
                                title: '提示已使用！',
                                text: '✨ 你还有'+(maxHints-hintsUsed)+'次提示机会哦！',
                                showConfirmButton: false,
                                timer: 3000,
                                timerProgressBar: true,
                                didOpen: (toast) => {
                                    toast.addEventListener('mouseenter', Swal.stopTimer);
                                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                                }
                            });

                            return;
                        }
                    }
                }
            }
        }
            alert("没有可以消除的图案！");
    }
    
    if(totalTime === 0)loseSound.play();
    
    // -------------------- 排行榜模块 --------------------

});
