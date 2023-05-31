$(document).ready(function(){

var addr1Name = $("input[name='addr1_name']").val();
var addr2Name = $("input[name='addr2_name']").val();
var addr3Name = $("input[name='addr3_name']").val();
var postno1Name = $("input[name='postno1_name']").val();
var postno2Name = $("input[name='postno2_name']").val();
var postNoErrorMName = $("input[name='postNoErrorM_name']").val();
var multi_addrnt_flg = $("input[name='multi_addrnt_flg']").val();

//アドレス1(県)を格納するjQueryオブジェクト
var addr1JObj;
//アドレス2(市町村)を格納するjQueryオブジェクト
var addr2JObj = $("input[name='" + addr2Name + "']");
//アドレス3(町名番地)を格納するjQueryオブジェクト
var addr3JObj = $("input[name='" + addr3Name + "']");
var postNoErrorM = document.getElementById(postNoErrorMName);

var addr2;
var clickJObj;
var url; // 非同期通信するURL（住所検索）
url = $("input[name='search_postcode_url_id']").val();

var contextPath; // コンテキストパス
contextPath = $("input[name='path_context']").val();

// 画像のパス
var imagePath = '/splot/images/';

//プレミアムの時はテキストボックス。それ以外はプルダウン
if ($("select[name='" + addr1Name + "']").size() > 0) {
	addr1JObj = $("select[name='" + addr1Name + "']");
} else {
	addr1JObj = $("input[name='" + addr1Name + "']");
}


$("#zip_search").click(function() {
	var currentJObj;
	var i;
	clickJObj = $(this);
	
	$.ajax({
		type: "POST",
		cache: true,
		url: url,
		dataType: "text",
  		data: {postno1:$("input[name='" + postno1Name + "']").val(),postno2:$("input[name='" + postno2Name + "']").val()},
		error: function(XMLHttpRequest, textStatus, errorThrown){},
		success: function(message){

			var data;
			var statusCode = 0;
			var errMessage = "";
			var addr1 = "";
			addr2 = "";
			var addr3 = "";

			try {
				data = JSON.parse(remove_newline(message)); //改行を消した後、JSONにパースする。
			} catch(e) {};
			if (data == null) {
				return;
			}
			if (data.status_code != null) { statusCode = data.status_code };
			if (data.err_message != null) { errMessage = data.err_message };
			if (data.addr1 != null) { addr1 = data.addr1 };
			if (data.addr2 != null) { addr2 = data.addr2 };
			if (data.addr3 != null) { addr3 = data.addr3 };
			
			// 1:正常登録完了
			if (statusCode == 1) {
				postNoErrorM.style.display = "none";
				//県
				addr1JObj.val(addr1);

				//市町村
				addr2JObj.val(addr2);

				//複数ある場合
				if ( addr3.length > 1 && multi_addrnt_flg == '1') {
					//既にポップアップがあるかチェックする
					if(!$("body").is(":has('#zip_select_popup')")) {
						$("body").prepend('<div style="display:none;z-index:2;position:absolute;text-align:center;width:400px" id="zip_select_popup"><img style="float:left" src="' + imagePath + 'sankaku_hidari.gif"><div id="zip_select_popup_body" style="background-color:#FFFFFF;float:left;background-color:#FFFFFF;text-align:center;padding:10px;border:solid 3px #959595;" ></div></div>')
					}
					//既に移動用のポップアップがあるかチェックする
					if(!$("body").is(":has('#zip_select_popup_move')")) {
						$("body").prepend('<div style="display:none;z-index:2;position:absolute;text-align:center;width:350px;background-color:#FFFFFF;border:solid 3px #959595;" id="zip_select_popup_move"></div>')
					}
					$("#zip_select_popup_body > *").remove();
					$("#zip_select_popup_body").append('<span style="font-size: 1.2em;display:block;border-bottom: 1px dotted rgb(193, 193, 193);font-weight: bolder;height: 24px;margin-bottom:10px;">地域が複数ヒットしました。以下からお選びください。</span>');
					$("#zip_select_popup_body").append('<ul></ul>');
					currentJObj = $("#zip_select_popup_body > ul");
					for (i = 0 ; i < addr3.length ; i++ ) {
						 currentJObj.append('<li style="cursor:pointer;color:#002656;list-style-type:none;"><a>' + addr3[i]  + '</a></li>');
					}

					currentJObj.after('<a id="zip_select_popup_close" style="cursor:pointer"><img style="margin-top:10px;" width="61" height="17" alt="閉じる" src="' + imagePath + 'close.gif"/></a>');

					$("#zip_select_popup").css("top", clickJObj.offset().top);
					$("#zip_select_popup").css("left", clickJObj.offset().left + clickJObj.width() + 10);
					$("#zip_select_popup").show();

					setPopUpEvent();
				}
				//複数ない場合
				else if ( addr3.length == 1 && multi_addrnt_flg == '1' ){
					addr3JObj.val(addr3);
				}

			}
			//エラー
			else {
				postNoErrorM.style.display = "";
				postNoErrorM.innerHTML = data.err_message;
				//県
				addr1JObj.val(addr1);
				//市町村
				addr2JObj.val(addr2);
				addr3JObj.val(addr3);
				return;
			}
		}
	});
});

function setPopUpEvent() {
	//選択された
	$("#zip_select_popup_body > ul > li").click(function() {
		var targetJObject = $("#" + addr3Name);
		var left = $("#zip_select_popup").offset().left + 9; //左の吹き出し画像の幅をプラスしている
		var top = $("#zip_select_popup").offset().top;
		var width = $("#zip_select_popup").width() - 9; //左の吹き出し画像の幅をマイナスしている
		var height = $("#zip_select_popup").height();
		var leftAfter = targetJObject.offset().left;
		var topAfter = targetJObject.offset().top;
		var widthAfter = targetJObject.width();
		var heightAfter = targetJObject.height();
		var selectAddr3 = $(this).text();


		$("#zip_select_popup_body > *").remove();

		$("#zip_select_popup_move").css("height",height);

		$("#zip_select_popup_move").css("opacity", "1.0");
		$("#zip_select_popup_move").css("left",left + "px");
		$("#zip_select_popup_move").css("top",top + "px");
		$("#zip_select_popup_move").css("width",width + "px");
		$("#zip_select_popup_move").css("height",height + "px");
		$("#zip_select_popup_move").show();
		$("#zip_select_popup").hide();

		$("#zip_select_popup_move").animate({
			opacity: 0.4,
		 	width: "150px",
			height: heightAfter,
			left:leftAfter,
			top:topAfter,
			padding: "0%"
		},
		250,
		"easeInCubic",
		 function() {
				$("#zip_select_popup_move").hide();
				addr2JObj.val(addr2);
				addr3JObj.val(selectAddr3);
		});

	});


	//閉じるが押された
	$("#zip_select_popup_close").click(function() {
		$("#zip_select_popup").hide();
		$("#zip_select_popup_body > *").remove();
	});
}


});

//改行を削除する
function remove_newline(text){
	text = text.replace(/\r\n/g, "");//IE
	text = text.replace(/\n/g, "");//Firefox
  return text;
}
