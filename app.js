document.addEventListener("DOMContentLoaded", function () {
    const basicButton = document.getElementById("基本模式");
    const leisureButton = document.getElementById("休闲模式");
    const levelButton = document.getElementById("关卡模式");
    const returnButton = document.getElementById("return-btn");

    const helpModel = document.getElementById("helpModel");
    const settingModel = document.getElementById("settingModel");

    const helpButton = document.getElementById("帮助");
    const settingButton = document.getElementById("设置");
    const helpbtn = document.getElementById("help-btn");
    const settingbtn = document.getElementById("setting-btn");
    const closeHelp = document.getElementById("closeHelp");
    const closeSetting = document.getElementById("closeSetting");

    const rankButton = document.getElementById("排行榜");

    // 模式按钮事件
    basicButton.addEventListener("click", gameMode);
    leisureButton.addEventListener("click", gameMode);
    levelButton.addEventListener("click", gameMode);

    // 返回按钮
    returnButton.addEventListener("click", function () {
        document.getElementById("mainMenu").style.display = "block";
        document.getElementById("gameScreen").style.display = "none";
    });

    // 帮助弹窗
    helpButton.addEventListener("click", function () {
        helpModel.style.display = "block";
    });

    closeHelp.addEventListener("click", function () {
        helpModel.style.display = "none";
    });

    // 设置弹窗
    settingButton.addEventListener("click", function () {
        settingModel.style.display = "block";
    });

    closeSetting.addEventListener("click", function () {
        settingModel.style.display = "none";
    });

    // 排行榜
   

    // 模式切换函数
    function gameMode() {
        document.getElementById("mainMenu").style.display = "none";
        document.getElementById("gameScreen").style.display = "block";
        renderBoard(); // 渲染游戏板
    }

    //初始化图片数据
    const images = {
        one:"image/one.png",
        two:"image/two.png",
        three:"image/three.png",
        four:"image/four.png",
        five:"image/five.png",
        six:"image/six.png",
        seven:"image/seven.png",
        eight:"image/eight.png",
        nine:"image/nine.png",
        ten:"image/ten.png",
        elven:"image/eleven.png",
        twelve:"image/twelve.png",
        thirteen:"image/thirteen.png",
        fourteen:"image/fourteen.png",
        fifteen:"image/fifteen.png",
        sixteen:"image/sixteen.png",
        seventeen:"image/seventeen.png",
        eighteen:"image/eighteen.png",
        nineteen:"image/nineteen.png"
    };

    let shuffledImages = [];
    const imageArray = Object.values(images); 
    for(let i = 0;i<imageArray.length;i++){
        for(let j= 0;j<10;j++){
        shuffledImages.push(imageArray[i]);
        }
    }

    shuffledImages.sort(() => Math.random() - 0.5); // 打乱数组顺序
    let board = [];
    let rows = 16;
    let cols = 10;
    for(let i = 0;i<rows;i++){
        board[i] = [];
        for(let j = 0;j<cols;j++){
            board[i][j] = shuffledImages.pop();
        }
    }

    function renderBoard(){
        const boardContainer = document.getElementById("gameBoard");
        boardContainer.innerHTML = ""; // 清空游戏板

        board.forEach((row, i) => {
            row.forEach((imagePath, j) => {
                const cell = document.createElement("div");
                cell.classList.add("game-cell");
                cell.style.backgroundImage = `url(${imagePath})`;  // 设置背景图片
                cell.dataset.row = i;
                cell.dataset.col = j;
    
                cell.addEventListener("click", handleCellClick);  // 给每个单元格添加点击事件
    
                boardContainer.appendChild(cell);
            });
        });
    }

    renderBoard();

    function handleCellClick(){
        console.log("Cell clicked!");
    };

    /**
     * Flip Clock Countdown Timer
     * 5分钟倒计时，数字翻转效果
     */
    let totalTime = 300; // 5 minutes in seconds
    let countdown = null;
    let isPaused = false; // 是否暂停

function startFlipClockCountdown() {
    if (countdown|| isPaused) {
       return; // 如果已经在倒计时中，或者处于暂停状态，则不再开始新的倒计时
    }
  updateClockDisplay(totalTime); // 初始化显示
   countdown = setInterval(() => {
    totalTime--;
    if (totalTime < 0) {
      clearInterval(countdown);
      return;
    }
    updateClockDisplay(totalTime);
  }, 1000);
}

function pauseCountdown() {
    if (countdown) {
        clearInterval(countdown);
        countdown = null;
        isPaused = true; // 设置为暂停状态
    }
}


function updateClockDisplay(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  const minTens = Math.floor(min / 10);
  const minOnes = min % 10;
  const secTens = Math.floor(sec / 10);
  const secOnes = sec % 10;

  flipTo("minuteTens", minTens);
  flipTo("minuteOnes", minOnes);
  flipTo("secondTens", secTens);
  flipTo("secondOnes", secOnes);
}

function flipTo(id, newNumber) {
  const digit = document.getElementById(id);
  if (digit.getAttribute("data-number") !== newNumber.toString()) {
    digit.setAttribute("data-number", newNumber);
    digit.classList.add("flip");
    setTimeout(() => digit.classList.remove("flip"), 500);
  }
}

const startButton = document.getElementById("start-btn");
const pauseButton = document.getElementById("pause-btn");

startButton.addEventListener("click", () => {
    isPaused = false; // 设置为非暂停状态
    startFlipClockCountdown();
});

pauseButton.addEventListener("click",pauseCountdown);

});

