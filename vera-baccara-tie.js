/* 設定変数 */
min_road_cnt = 10; //リセット後に待つ回数

tie_entry_chain = 10; //Tie不連続を待つ回数
tie_entry_limit_cnt = 10; //TieへBetする回数上限

/* システム変数 */
tie_chain_cnt = 0;
wait_open = false;
wait_tie = false;
tie_bet_cnt = 0;
checkInterval = 2; //秒

interval_que = function(){
	chkRoad();
	leave_idol();
	setTimeout(function(){ interval_que(); }, checkInterval * 1000)
}

leave_idol = function(){
	//アイドル回避
	if ( $('div[data-role="inactivity-message-clickable"]:visible',fdoc).length == 1 ) {
		$('div[data-role="inactivity-message-clickable"]:visible',fdoc).click();
	}
}

chkRoad = function(){

	betarea = $("div[data-role='footer-perspective-container']",fdoc);
	road = $('svg[data-role="Bead-road"] svg[data-type="roadItem"]',fdoc);
	if ( road.length > min_road_cnt ) {
		if ( $(betarea,fdoc).attr("data-is-collapsed") == "false" && wait_open == true ) {
			//bet open
			//road[0]; //first
			//road[road.length-1]; //last
			tie_chain_cnt = 0;
			for(var r = 0; r < road.length; r++){
				var c = road[road.length-1-r];
				if ( $(c,fdoc).attr("name") != "Tie" && tie_chain_cnt != -1) {
					tie_chain_cnt += 1;
					if ( tie_chain_cnt > tie_entry_chain ) {
						break;
					}
				} else {
					tie_chain_cnt = 0;
					break;
				}
			};
			if ( tie_chain_cnt > tie_entry_chain ) {
				if ( tie_bet_cnt > tie_entry_limit_cnt ) {
					console.log("Tie不連続 BET回数が規定回数に到達したのでストップ");
					tie_bet_cnt = 0;
					tie_chain_cnt = 0;
				} else {
					//Tie不連続でのベット
					console.log("Tie不連続でのベット");
					$('div[data-role="bet-spot-tie"]',fdoc).click();
					tie_bet_cnt += 1;
				}
				wait_open = false;
			}
			
		} else {
			if ( $(betarea,fdoc).attr("data-is-collapsed") == "false" ) {
			} else {
				//bet close
				wait_open = true;
			}
		}
	} else {
		console.log("テーブルリセットの為待機");
	}

}

game_init = function(){
	$('div[data-role="unmountable-video-first-level"]',fdoc).hide();
}

//jQuery Load
var fdoc = null;
var s = document.createElement("script");
s.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js";
s.onload = function(){
	fdoc = $($("iframe").eq(0).contents());
	game_init();
	interval_que();
};
document.body.append(s);



//$('div[data-role="reality-check-popup"]:visible',fdoc).length
//$(fdoc).find("iframe").attr("src")
//"https://evolutionlive.plaingaming.net/entry?params=QVVUSF9UT0tFTj1kYmUwMmNiM2JmNDAyZWI3MjE3ZDczNGY4Mzg0ZDY5OTM0ODA4NmI5CmNhdGVnb3J5PWJhY2NhcmF0CnNpdGU9MQ&JSESSIONID=dbe02cb3bf402eb7217d734f8384d699348086b9"

/*
div[class*='TableSnapshot']{
    display: none;
}
*/
