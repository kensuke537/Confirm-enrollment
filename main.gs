function doPost(e) {
  var json = JSON.parse(e.postData.contents);
  if (json.type === 'url_verification') {
    return ContentService.createTextOutput(json.challenge);
  }
  var command = json.event.text;

  if (command.includes('!mnb')) {
    var emailRegex = /<mailto:([^|>]+)\|/;
    var match = command.match(emailRegex);
    console.info(emailRegex)
    console.log(emailRegex)
     if (match) {
       var email = match[1];
    var spp = SpreadsheetApp.openById("sheetID");
    var shhee = spp.getSheetByName("sheetname");
    let low = shhee.getLastRow();
    shhee.getRange(low + 1, 1).setValue(email);
    sendNameToSlack(email)
     }
  }
}

function sendNameToSlack(email) {
  var emailColumn = 1; // メールアドレスが格納されている列（A列）
  var nameColumn = 2; // 名前が格納されている列（B列）
  var slacknameColumn = 3;
  var status =4;
  var pjsurls = 5;
  var imgColumn = 6; // 画像が格納されている列（C列）
  var login_log = 7;
  // Slackの設定
  var slackWebhookUrl = ""; // SlackのWebhook URL

  // スプレッドシートから名前と画像を取得
  var spreadsheet = SpreadsheetApp.openById("");// sheetid
  var sheet = spreadsheet.getSheetByName("");// sheetname
  var data = sheet.getDataRange().getValues();

  var name = "";
  var imgpf = "";
  var slackname = "";
  var statuss ="";

  for (var i = 0; i < data.length; i++) {
    if (data[i][emailColumn - 1] === email) {
      name = data[i][nameColumn - 1];
      slackname= data[i][slacknameColumn -1];
      statuss = data[i][status -1]
      imgpf = data[i][imgColumn - 1];
      loginlog = data[i][login_log - 1];
      break;
    }
  }

  // Slackに結果を送信
 if (name !== "") {
  // 名前がある場合の処理
    var blocks = [
     {
			"type": "section",
			"text": {
				"type": "mrkdwn",
        "text": `名前: ${name}\nSlack名： ${slackname}\n活動状況： ${statuss}\nメールアドレス：${email}\nログイン回数${loginlog}`
			},
			"accessory": {
				"type": "image",
				"image_url": imgpf,
				"alt_text": name
			}
		}
  ];

  var payload = {
    "blocks": blocks
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  var response = UrlFetchApp.fetch(slackWebhookUrl, options);
  Logger.log(response.getContentText());

} else {
  var ttt = "`"
	var blocks = [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `${ttt}${email}${ttt}に対するデーターがありませんでした！`
			}
		}
	];

  var payload = {
    "blocks": blocks
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  var response = UrlFetchApp.fetch(slackWebhookUrl, options);
  Logger.log(response.getContentText());
}
}
