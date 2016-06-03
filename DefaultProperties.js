// [Default Stats]
var NUMBER_OF_GEM_IN_A_ROW = 8;
var NUMBER_OF_GEM_ON_GRID = NUMBER_OF_GEM_IN_A_ROW * NUMBER_OF_GEM_IN_A_ROW;
var NUMBER_OF_GEM_COLOR = 7;
var NUMBER_OF_PARTICLES = 40;
var WIDTH_GEM = 65;
var HEIGHT_GEM = 65;
var X_GRID = 250; // Vị trí gốc x của bàn cờ
var Y_GRID = 40; // Vị trí gốc y của bàn cờ
var X_END_GRID = (X_GRID + WIDTH_GEM * NUMBER_OF_GEM_IN_A_ROW) - WIDTH_GEM; // Vị trí gốc x cuối của bàn cờ
var Y_END_GRID = (Y_GRID + HEIGHT_GEM * NUMBER_OF_GEM_IN_A_ROW) - HEIGHT_GEM; // Vị trí gốc y cuối của bàn cờ
var GO = 2;

// Time
var SET_TIME = 60000;
var WIDTH_BAR = 520;

// Bonus time
var NORMAL_VALUE = 350;
var BOMB_VALUE = 400;
var LIGHTNING_VALUE = 450;

// Score
var NORMAL_SCORE = 50;
var BOMB_SCORE = 200;
var LIGHTNING_SCORE = 300;

var POINTER_ID = 1; // Default

var COLOR_GEM = {
    Blue: 0,
    Green: 1,
    Orange: 2,
    Purple: 3,
    Red: 4,
    Yellow: 5,
    White: 6
}

var STATE_GEM = {
    normal: 0, // có kim cương
    empty: 1, // kim cương được đánh dấu để xóa
    charge: 2, // kim cương đã bị xóa được đánh dấu để lấp đầy bởi viên phía trên kế nó
    bomb: 3, // kim cương lửa (4 viên kim cương kết hợp)
    lightning: 4, // kim cương điện (5 viên kim cương kết hợp)
    emptyBomb: 5, // kim cương được đánh dấu để xóa (hiệu ứng Bomb)
    emptyLightning: 6 // kim cương được đánh dấu để xóa (hiệu ứng Lightning)
}

var ANIMATION_STATE = {
    Wait : 0, // Chờ
    Swap : 1, // Tráo
    Match : 2, // Kiểm tra "match"
    Destroy : 3, // Xóa
    Fall : 4, // Đổ xuống
    Check : 5, // Kiểm tra sau "fall"
    CaculatePoint : 6 // Tính điểm
}